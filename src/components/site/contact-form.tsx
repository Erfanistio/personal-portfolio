"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "success" | "error" | "not_configured";

const BUDGETS = [
  "Not sure yet",
  "Under $5k",
  "$5k to $15k",
  "$15k to $40k",
  "Retainer",
];

export function ContactForm({ configured }: { configured: boolean }) {
  const [status, setStatus] = useState<Status>(configured ? "idle" : "not_configured");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          company: String(data.get("company") ?? ""),
          budget: String(data.get("budget") ?? ""),
          message: String(data.get("message") ?? ""),
          website: String(data.get("website") ?? ""),
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (response.status === 503) {
        setStatus("not_configured");
        setMessage(result.message ?? `Write to ${site.email} instead.`);
        return;
      }

      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(result.message ?? "Something went wrong. Please email me directly.");
        return;
      }

      setStatus("success");
      setMessage(result.message ?? "Thanks. I will get back to you shortly.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("The request could not be sent. Please email me directly.");
    }
  }

  if (status === "not_configured") {
    return (
      <div className="card flex h-full flex-col justify-between gap-8 p-7 md:p-9">
        <div>
          <p className="mono-label">Form not connected</p>
          <p className="display-md mt-4">The fastest route right now is email.</p>
          <p className="body-md mt-4 max-w-md">
            {message ||
              "The contact form needs a Supabase or email provider key before it can deliver messages."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${site.email}`} className="btn btn-primary">
            {site.email}
            <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <a href={site.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card flex h-full flex-col gap-5 p-7 md:p-9" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="contact-company">Company or project</label>
          <input id="contact-company" name="company" autoComplete="organization" placeholder="Optional" />
        </div>
        <div className="field">
          <label htmlFor="contact-budget">Budget</label>
          <select id="contact-budget" name="budget" defaultValue={BUDGETS[0]}>
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-message">What are you building?</label>
        <textarea
          id="contact-message"
          name="message"
          required
          placeholder="Scope, audience, timeline. A few sentences is plenty."
        />
      </div>

      {/* Honeypot. Real people never see it. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-4 pt-1">
        <p
          aria-live="polite"
          className="max-w-[19rem] text-sm leading-relaxed"
          style={{
            color:
              status === "success"
                ? "#9b6cff"
                : status === "error"
                  ? "#ff4797"
                  : "#858b88",
          }}
        >
          {status === "success" && (
            <Check size={14} className="mr-1 inline align-[-2px]" aria-hidden="true" />
          )}
          {message}
        </p>

        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              Sending
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            </>
          ) : (
            <>
              Send message
              <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
