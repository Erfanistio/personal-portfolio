import {
  siFigma,
  siGreensock,
  siNextdotjs,
  siReact,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVercel,
} from "simple-icons";

const tools = [
  { name: "Next.js", icon: siNextdotjs },
  { name: "React", icon: siReact },
  { name: "TypeScript", icon: siTypescript },
  { name: "Three.js", icon: siThreedotjs },
  { name: "GSAP", icon: siGreensock },
  { name: "Tailwind", icon: siTailwindcss },
  { name: "Supabase", icon: siSupabase },
  { name: "Figma", icon: siFigma },
  { name: "Vercel", icon: siVercel },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {tools.map(({ name, icon }) => (
        <div key={name} className="flex items-center gap-3 px-7 md:px-9">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-ivory/70"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={icon.path} />
          </svg>
          <span className="whitespace-nowrap font-display text-sm tracking-tight text-ivory/55">
            {name}
          </span>
          <span className="ml-7 h-1 w-1 rounded-full bg-violet/70 md:ml-9" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

export function TechMarquee() {
  return (
    <section
      className="marquee relative border-y border-[var(--line)] py-5 md:py-6"
      aria-label="Tools and technologies I work with"
    >
      <div className="shell mb-5 flex items-center justify-between md:mb-6">
        <span className="mono-label">Toolkit</span>
        <span className="mono-label hidden sm:block">Selected tools, used in production</span>
      </div>
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
