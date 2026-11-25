"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/content/projects";
import { site } from "@/content/site";

const COVERS: [string, string][] = [
  ["#9b6cff", "#2d79f0"],
  ["#ff4797", "#9b6cff"],
  ["#2d79f0", "#9b6cff"],
  ["#9b6cff", "#ff4797"],
  ["#2d79f0", "#ff4797"],
  ["#ff4797", "#2d79f0"],
];

function Cover({ project, index }: { project: Project; index: number }) {
  if (project.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image_url}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    );
  }

  const [from, to] = COVERS[index % COVERS.length];
  const gradientId = `cover-${project.slug}`;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(120% 100% at 18% 0%, ${from}26, transparent 62%), linear-gradient(155deg, #1a1e20 0%, #111315 70%)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        {Array.from({ length: 7 }, (_, ring) => (
          <ellipse
            key={ring}
            cx="200"
            cy="200"
            rx={58 + ring * 30}
            ry={38 + ring * 26}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="1"
            opacity={0.5 - ring * 0.055}
            transform={`rotate(${ring * 26} 200 200)`}
          />
        ))}
        <circle cx="200" cy="200" r="44" fill={`url(#${gradientId})`} opacity="0.4" />
        <circle cx="200" cy="200" r="44" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      </svg>
      <span className="absolute left-6 top-6 mono-label">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const target = project.href ?? "#contact";
  const label = project.href ? "View project" : "Case study on request";

  return (
    <article className="gallery-card card group flex w-[clamp(300px,36vw,520px)] flex-col transition-colors duration-300 hover:border-[var(--line-strong)]">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Cover project={project} index={index} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,19,21,0.9)_0%,rgba(17,19,21,0.35)_38%,transparent_65%)]"
        />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="tag">{project.role}</span>
            <span className="mono-label">{project.year}</span>
          </div>
          <h3 className="mt-4 font-display text-3xl leading-none tracking-tight">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-ivory/70">{project.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-[var(--line)] p-5">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <a
          href={target}
          className="link-line self-start text-sm font-medium text-ivory transition-colors hover:text-violet"
        >
          {label}
          <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // Lenis already smooths the scroll position, so the track is tied 1:1 to
      // it. Adding ScrollTrigger's own catch-up scrub on top produced a
      // rubbery, stepped feel, especially on fast wheel flicks.
      const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

      gsap.set(track, { force3D: true });

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, [projects.length]);

  return (
    <>
      <section
        id="work"
        ref={sectionRef}
        aria-labelledby="work-title"
        className="relative lg:flex lg:h-[100svh] lg:flex-col lg:overflow-hidden lg:pb-8"
      >
        <div className="shell flex items-end justify-between gap-8 pb-6 pt-24 md:pb-8 md:pt-32">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title" className="display-lg mt-4">
              A few things I&apos;ve built.
            </h2>
          </div>
          <p className="mono-label gallery-hint hidden max-w-[15rem] text-right md:block">
            Scroll to travel across the set
          </p>
          <p className="mono-label md:hidden">Swipe across</p>
        </div>

        <div className="gallery-viewport lg:flex-1 lg:min-h-0">
          <div className="gallery-track" ref={trackRef}>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}

            <article className="gallery-card card flex w-[clamp(280px,30vw,420px)] flex-col justify-between gap-10 p-7">
              <span className="eyebrow">Next</span>
              <div>
                <h3 className="display-md">Something new in mind?</h3>
                <p className="body-md mt-3 max-w-[22rem]">
                  Tell me who it is for and when it needs to exist.
                </p>
              </div>
              <a href="#contact" className="btn btn-primary self-start">
                Start a conversation
                <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* A plain list of the same work, for keyboard and screen-reader users. */}
      <section aria-label="Project index" className="shell pb-16 pt-12 md:pb-20">
        <div className="rule mb-2" />
        <ol>
          {projects.map((project, index) => (
            <li key={project.id}>
              <a
                href={project.href ?? "#contact"}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-[var(--line)] py-5 transition-colors hover:bg-[rgba(243,241,234,0.03)] md:grid-cols-[3rem_minmax(0,14rem)_minmax(0,1fr)_5rem_1.5rem] md:py-6"
              >
                <span className="mono-label">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg tracking-tight text-ivory transition-colors group-hover:text-violet md:text-xl">
                  {project.title}
                </span>
                <span className="col-span-2 text-sm text-muted md:col-span-1 md:col-start-3">
                  {project.subtitle}
                </span>
                <span className="mono-label hidden md:block md:text-right">
                  {project.year}
                </span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.6}
                  className="hidden text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-violet md:block"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted">
          Prefer a quick reply? Email{" "}
          <a href={`mailto:${site.email}`} className="link-line text-ivory">
            {site.email}
          </a>
        </p>
      </section>
    </>
  );
}
