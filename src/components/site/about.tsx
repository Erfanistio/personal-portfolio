import { Reveal } from "@/components/ui/reveal";
import { site } from "@/content/site";

export function About() {
  const { about } = site;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="shell scroll-mt-24 py-20 md:py-28"
    >
      <div className="rule mb-10 md:mb-14" />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="self-start lg:sticky lg:top-28">
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 id="about-title" className="display-lg mt-4">
              {about.headline}
            </h2>
          </Reveal>

          <Reveal delay={90} className="mt-10 border-t border-[var(--line)] pt-6">
            <dl className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="mono-label">Based</dt>
                <dd className="mt-1.5 text-ivory/80">{site.location}</dd>
              </div>
              <div>
                <dt className="mono-label">Currently</dt>
                <dd className="mt-1.5 flex items-center gap-2 text-ivory/80">
                  <span
                    className="block h-1.5 w-1.5 rounded-full bg-violet"
                    aria-hidden="true"
                  />
                  {site.availability}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div>
          <Reveal className="max-w-2xl space-y-5">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="body-lg">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {about.capabilities.map((capability, index) => (
              <Reveal key={capability.title} delay={index * 70}>
                <div className="border-t border-[var(--line)] pt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-lg tracking-tight">
                      {capability.title}
                    </h3>
                    <span className="mono-label">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {capability.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-14 border-t border-[var(--line)] pt-6">
            <p className="mono-label">How I work</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {about.principles.map((principle) => (
                <li
                  key={principle}
                  className="flex items-start gap-2.5 text-sm text-ivory/80"
                >
                  <span
                    className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-violet"
                    aria-hidden="true"
                  />
                  {principle}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
