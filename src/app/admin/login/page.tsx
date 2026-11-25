"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [message, setMessage] = useState("");

  const requested = searchParams.get("next") ?? "/admin";
  const next = requested.startsWith("/admin") ? requested : "/admin";

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setStatus("checking");
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "Wrong email or password.");
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  const busy = status === "checking";

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-20">
      <div className="card w-full max-w-md p-8">
        <header className="mb-8 text-center">
          <p className="mono-label">Admin access</p>
          <h1 className="display-md mt-4">Sign in to manage</h1>
          <p className="body-md mt-4 text-muted">
            Use the admin email and password to open the dashboard.
          </p>
        </header>

        <form onSubmit={signIn} className="space-y-5">
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="admin-email"
                type="email"
                name="email"
                required
                autoComplete="username"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-10"
                placeholder="you@domain.com"
                disabled={busy}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="admin-password"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-10"
                placeholder="Your password"
                disabled={busy}
              />
            </div>
          </div>

          <p
            aria-live="polite"
            role={status === "error" ? "alert" : undefined}
            className="min-h-5 text-sm"
            style={{ color: status === "error" ? "#ff4797" : "#858b88" }}
          >
            {message}
          </p>

          <button type="submit" className="btn btn-primary w-full justify-center" disabled={busy}>
            {busy ? (
              <>
                Signing in
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Not the admin?{" "}
          <Link href="/" className="link-line text-ivory">
            Back to portfolio
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={<main className="flex min-h-svh items-center justify-center px-6 py-20" />}
    >
      <LoginForm />
    </Suspense>
  );
}
