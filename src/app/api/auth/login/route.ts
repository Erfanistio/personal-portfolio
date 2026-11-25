import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCredentials,
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth/admin";

export async function POST(request: Request) {
  let email = "";
  let password = "";

  try {
    const body = await request.json();
    email = String(body?.email ?? "");
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  if (!email.trim() || !password) {
    return NextResponse.json(
      { ok: false, message: "Enter your email and password." },
      { status: 400 },
    );
  }

  if (!adminCredentials().configured) {
    return NextResponse.json(
      {
        ok: false,
        message: "Admin login is not set up. Add ADMIN_EMAIL and ADMIN_PASSWORD to the environment.",
      },
      { status: 503 },
    );
  }

  const result = await verifyAdminCredentials(email, password);
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "Wrong email or password." }, { status: 401 });
  }

  const session = await createAdminSession(email.trim().toLowerCase());
  if (!session) {
    return NextResponse.json(
      { ok: false, message: "Could not start a session." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: session.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: session.expiresAt,
  });

  return response;
}
