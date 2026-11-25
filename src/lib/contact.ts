import { contactChannel } from "./supabase/config";
import { createSupabasePublicClient } from "./supabase/public";
import { createSupabaseAdminClient } from "./supabase/admin";
import { site } from "@/content/site";

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
};

export type DeliveryResult = {
  ok: boolean;
  channel: "supabase" | "resend" | "formspree" | "none";
  detail?: string;
};

async function storeInSupabase(payload: ContactPayload, source: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient() ?? createSupabasePublicClient();
  if (!supabase) return false;

  const { error } = await supabase.from("contact_requests").insert({
    name: payload.name,
    email: payload.email,
    company: payload.company ?? null,
    budget: payload.budget ?? null,
    message: payload.message,
    status: "new",
    source,
  });

  if (error) {
    console.error("[contact] Supabase insert failed:", error.message);
    return false;
  }
  return true;
}

async function sendWithResend(payload: ContactPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return false;

  const from = process.env.CONTACT_FROM_EMAIL ?? `Portfolio <onboarding@resend.dev>`;
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    payload.budget ? `Budget: ${payload.budget}` : null,
    "",
    payload.message,
  ].filter(Boolean);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `New project inquiry from ${payload.name}`,
        text: lines.join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("[contact] Resend failed:", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contact] Resend request failed:", error);
    return false;
  }
}

async function sendWithFormspree(payload: ContactPayload): Promise<boolean> {
  const formId = process.env.FORMSPREE_FORM_ID;
  if (!formId) return false;

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        company: payload.company,
        budget: payload.budget,
        message: payload.message,
        _subject: `New project inquiry from ${payload.name}`,
      }),
    });

    if (!response.ok) {
      console.error("[contact] Formspree failed:", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contact] Formspree request failed:", error);
    return false;
  }
}

/**
 * Provider-agnostic delivery. Supabase is the default store; email providers
 * are used when Supabase is absent or a write fails. If nothing is configured
 * the caller gets an honest `none` result instead of a fake success.
 */
export async function deliverContact(
  payload: ContactPayload,
  source = "portfolio",
): Promise<DeliveryResult> {
  const channel = contactChannel();

  if (channel === "supabase") {
    const stored = await storeInSupabase(payload, source);
    if (stored) return { ok: true, channel: "supabase" };
    if (await sendWithResend(payload)) return { ok: true, channel: "resend" };
    if (await sendWithFormspree(payload)) return { ok: true, channel: "formspree" };
    return {
      ok: false,
      channel: "supabase",
      detail: "The database rejected the request. Email me directly instead.",
    };
  }

  if (channel === "resend" && (await sendWithResend(payload))) {
    return { ok: true, channel: "resend" };
  }

  if (channel === "formspree" && (await sendWithFormspree(payload))) {
    return { ok: true, channel: "formspree" };
  }

  return {
    ok: false,
    channel: "none",
    detail: `The form is not connected yet. Write to ${site.email} instead.`,
  };
}
