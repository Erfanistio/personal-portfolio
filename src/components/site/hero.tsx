"use client";

import WayglimBackground from "@/components/creative/wayglim-background";
import { FlowButton } from "@/components/ui/flow-button";
import { RotatingText } from "@/components/ui/rotating-text";
import { site } from "@/content/site";

const FEEL_VARIANTS = [
  "you can feel.",
  "you remember.",
  "you trust.",
  "you return to.",
  "you share.",
];

export function Hero() {
  const { hero } = site;

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#07040f]"
      aria-labelledby="hero-title"
    >
      <WayglimBackground className="opacity-95" />

      {/* Keeps the type legible over the brightest part of the shader. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(17,19,21,0.18)_0%,rgba(17,19,21,0.06)_38%,rgba(17,19,21,0.78)_86%,#111315_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_78%_22%,transparent_0%,rgba(17,19,21,0.42)_70%)]"
      />

      <div className="shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-8 pt-32 md:pb-10">
        <div className="grid gap-10">
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>

            <h1 id="hero-title" className="display-xl mt-7 max-w-6xl md:mt-9">
              <span aria-hidden="true">
                {hero.headline[0]}
                <br />
                <span className="accent-underline text-violet">
                  <RotatingText variants={FEEL_VARIANTS} interval={5000} />
                </span>
              </span>
              <span className="sr-only">
                {hero.headline[0]} {hero.headline[1]}
              </span>
            </h1>

            <div className="mt-10 grid gap-9 md:mt-12 md:grid-cols-[minmax(0,32rem)_auto] md:items-end md:gap-14">
              <p className="body-lg max-w-xl">{hero.intro}</p>

              <div className="flex flex-wrap items-center gap-3">
                <FlowButton asChild size="lg" className="btn btn-primary">
                  <a href={hero.primaryCta.href}>
                    {hero.primaryCta.label}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="size-[15px]"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </FlowButton>
                <a href={hero.secondaryCta.href} className="btn btn-ghost">
                  {hero.secondaryCta.label}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-[var(--line)] pt-6 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-8">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl tracking-tight text-ivory">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs leading-relaxed text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#work"
            className="group flex items-center gap-3 text-xs text-muted transition-colors hover:text-ivory"
          >
            <span className="relative block h-9 w-px overflow-hidden bg-[var(--line-strong)]">
              <span className="pulse-dot absolute left-0 top-0 block h-3 w-px bg-violet" />
            </span>
            Scroll to explore
          </a>
        </div>
      </div>
    </section>
  );
}
