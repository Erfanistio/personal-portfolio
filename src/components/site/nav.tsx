"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { NavLogo } from "@/components/site/nav-logo";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled &&
          "border-b border-[var(--line)] bg-obsidian/85 backdrop-blur-xl",
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <NavLogo onNavigate={() => setOpen(false)} />

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-line text-sm text-ivory/70 transition-colors hover:text-ivory"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href="#contact" className="btn btn-ghost min-h-10">
            Let&apos;s talk
            <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="border-t border-[var(--line)] bg-obsidian/95 px-6 pb-8 pt-4 backdrop-blur-xl md:hidden"
        >
          {site.nav.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center justify-between border-b border-[var(--line)] font-display text-2xl tracking-tight"
            >
              {item.label}
              <span className="mono-label">0{index + 1}</span>
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="mt-6 block text-sm text-muted"
            onClick={() => setOpen(false)}
          >
            {site.email}
          </a>
        </nav>
      )}
    </header>
  );
}
