export const ADMIN_COOKIE = "erfan_admin";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const encoder = new TextEncoder();

type AdminCredentials = {
  email: string | null;
  password: string | null;
  configured: boolean;
};

/**
 * The admin account is a single static email and password pair from the
 * environment. It never touches Supabase auth or sends email.
 */
export function adminCredentials(): AdminCredentials {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;
  const password = process.env.ADMIN_PASSWORD || null;

  return { email, password, configured: Boolean(email && password) };
}

async function digest(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return new Uint8Array(hash);
}

/** Length-safe comparison so a wrong guess leaks nothing about the real value. */
function equalBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a[index] ^ b[index];
  }
  return diff === 0;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const { email: expectedEmail, password: expectedPassword, configured } = adminCredentials();

  if (!configured || !expectedEmail || !expectedPassword) {
    return { ok: false as const, configured: false as const };
  }

  const [givenEmail, givenPassword, realEmail, realPassword] = await Promise.all([
    digest(email.trim().toLowerCase()),
    digest(password),
    digest(expectedEmail),
    digest(expectedPassword),
  ]);

  const emailMatches = equalBytes(givenEmail, realEmail);
  const passwordMatches = equalBytes(givenPassword, realPassword);

  if (!emailMatches || !passwordMatches) {
    return { ok: false as const, configured: true as const };
  }

  return { ok: true as const, configured: true as const, email: expectedEmail };
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

/**
 * The signing key is derived from the password, so rotating ADMIN_PASSWORD
 * also invalidates every session that was already issued.
 */
async function sessionKey(password: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(`erfan-admin-session:${password}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createAdminSession(email: string) {
  const { password } = adminCredentials();
  if (!password) return null;

  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = encodeBase64Url(
    encoder.encode(JSON.stringify({ sub: email, exp: expiresAt })),
  );
  const key = await sessionKey(password);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return {
    token: `${payload}.${encodeBase64Url(new Uint8Array(signature))}`,
    expiresAt: new Date(expiresAt),
  };
}

export async function readAdminSession(token: string | null | undefined) {
  const { email, password, configured } = adminCredentials();
  if (!configured || !email || !password || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  let valid = false;
  try {
    const key = await sessionKey(password);
    valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(signature),
      encoder.encode(payload),
    );
  } catch {
    return null;
  }

  if (!valid) return null;

  try {
    const data = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload))) as {
      sub?: unknown;
      exp?: unknown;
    };

    if (data.sub !== email) return null;
    if (typeof data.exp !== "number" || data.exp <= Date.now()) return null;

    return { email };
  } catch {
    return null;
  }
}
