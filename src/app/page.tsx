"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import SynapseFolioHero from "@/components/ui/synapse-folio-hero";

const WORK_SLOTS = [
  {
    index: "01",
    title: "Project 01 [Placeholder Slot]",
    scope: "Frontend Engineering / Next.js",
    year: "2026",
  },
  {
    index: "02",
    title: "Project 02 [Placeholder Slot]",
    scope: "Product Design / Design System",
    year: "2026",
  },
  {
    index: "03",
    title: "Project 03 [Placeholder Slot]",
    scope: "Creative Motion / React & Tailwind",
    year: "2025",
  },
];

const SOCIALS = [
  {
    index: "01",
    label: "GitHub",
    handle: "erfanistio",
    href: "https://github.com/erfanistio",
  },
  {
    index: "02",
    label: "X (Twitter)",
    handle: "@unluckyerfan",
    href: "https://x.com/unluckyerfan",
  },
  {
    index: "03",
    label: "Telegram",
    handle: "@unluckyerfan",
    href: "https://t.me/unluckyerfan",
  },
  {
    index: "04",
    label: "Instagram",
    handle: "@erfanistio_",
    href: "https://instagram.com/erfanistio_",
  },
];

export default function HomePage() {
  return (
    <main id="top" className="w-full bg-[#FBFBFE] text-[#1F2FB0]">
      {/* Synapse Folio Hero recreated for Erfan Akrami */}
      <SynapseFolioHero
        brand="ERFAN AKRAMI"
        city="THR"
        timeZone="Asia/Tehran"
        lead={[
          "I design",
          { slot: "star" },
          "interfaces that shape how",
          { box: "people and products" },
          "connect.",
          { slot: "links" },
        ]}
        body={[
          "From design systems to interactive frontends, my work",
          { slot: "eye" },
          "lives at the intersection of",
          { slot: "coral" },
          "craft and engineering.",
        ]}
        note="BUILDING INTERFACES BETWEEN PEOPLE AND PRODUCTS"
        noteTag="NEXT.JS"
        essentially="MY JOB IS TO HELP TEAMS SHIP WEB PRODUCTS THEY CAN TRUST: EXPRESSIVE INTERFACES, CLEAN REACT ARCHITECTURE, AND MOTION SYSTEMS THAT KEEP PEOPLE IN CHARGE."
        playIntro
      />

      {/* §01 Selected Work */}
      <section
        id="work"
        aria-labelledby="work-heading"
        className="border-t border-[#1F2FB0]/15 px-[clamp(16px,2.2vw,32px)] py-20 lg:py-28"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium tracking-[0.06em] uppercase opacity-70">
              §01 Selected Work
            </p>
            <h2
              id="work-heading"
              className="font-sy-serif mt-3 text-4xl font-light tracking-[-0.028em] sm:text-5xl"
            >
              Index of projects
            </h2>
            <p className="mt-4 max-w-xs text-xs leading-relaxed uppercase opacity-75">
              Editable placeholder slots in src/app/page.tsx ready for your real shipped case studies.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-[#1F2FB0]/20 border-y border-[#1F2FB0]/20">
              {WORK_SLOTS.map((item) => (
                <li
                  key={item.index}
                  className="grid grid-cols-1 items-baseline gap-2 py-6 sm:grid-cols-12"
                >
                  <span className="text-xs font-medium sm:col-span-2">
                    ({item.index})
                  </span>
                  <span className="font-sy-serif text-2xl font-light tracking-[-0.02em] sm:col-span-5 sm:text-3xl">
                    {item.title}
                  </span>
                  <span className="text-xs uppercase opacity-75 sm:col-span-4">
                    {item.scope}
                  </span>
                  <span className="text-xs sm:col-span-1 sm:text-right">
                    {item.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* §02 Contact Footer */}
      <footer
        id="contact"
        aria-labelledby="contact-heading"
        className="border-t border-[#1F2FB0]/15 px-[clamp(16px,2.2vw,32px)] pt-20 pb-12 lg:pt-28"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium tracking-[0.06em] uppercase opacity-70">
              §02 Contact
            </p>
            <h2
              id="contact-heading"
              className="font-sy-serif mt-3 text-5xl leading-[0.98] font-light tracking-[-0.028em] sm:text-7xl"
            >
              Let&apos;s build something sharp.
            </h2>
          </div>

          <div className="lg:col-span-6">
            <ul className="divide-y divide-[#1F2FB0]/20 border-y border-[#1F2FB0]/20">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[54px] items-center justify-between py-3 transition-colors hover:bg-[#E9ECFB]/60 hover:px-2"
                  >
                    <span className="flex items-center gap-4 text-xs font-medium tracking-[0.05em] uppercase">
                      <span className="opacity-60">{item.index}</span>
                      <span>{item.label}</span>
                      <span className="lowercase opacity-70">{item.handle}</span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[#1F2FB0]/15 pt-6 text-[11px] tracking-[0.05em] uppercase opacity-75 sm:flex-row sm:items-center">
          <span>© 2026 Erfan Akrami / Frontend Developer & Product Designer</span>
          <a href="#top" className="underline-offset-4 hover:underline">
            Back to top
          </a>
        </div>
      </footer>
    </main>
  );
}
