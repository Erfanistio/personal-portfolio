import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { NavLogo } from "@/components/site/nav-logo";
import { Component as KineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";
import { Preloader } from "@/components/site/preloader";
import { Hero } from "@/components/site/hero";
import { TechMarquee } from "@/components/site/tech-marquee";
import { ProjectGallery } from "@/components/site/project-gallery";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { getPublishedProjects } from "@/lib/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} · ${site.role}`,
  description: site.description,
};

export default async function HomePage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <Preloader />
      <KineticNavigation
        links={site.nav.map((item) => ({ label: item.label, href: item.href }))}
        logo={<NavLogo />}
        headerAction={
          <a
            href="#contact"
            className="btn btn-ghost nav-header-action min-h-10 hidden md:inline-flex"
          >
            Let&apos;s talk
            <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </a>
        }
      />
      <main id="main" className="flex-1">
        <Hero />
        <TechMarquee />
        <ProjectGallery projects={projects} />
        <About />
        <Contact />
      </main>
      {/* The footer is the wordmark and nothing else. */}
      <HalftoneWordmarkFooter
        wordmark="erfan."
        label=""
        meta=""
        columns={[]}
        backToTop={false}
        palette={{ background: "#111315", ink: "#F3F1EA", warm: "#9B6CFF" }}
        fontFamily="var(--font-display)"
        fontWeight={700}
        height="clamp(200px, 22vw, 440px)"
        crop={0.18}
        dotGap={6}
        className="border-t border-[var(--line)]"
      />
    </>
  );
}
