import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { EyeTrackerPet } from "@/components/site/eye-tracker-pet";
import { site } from "@/content/site";

const spaceGrotesk = localFont({
  src: "../../public/fonts/space-grotesk-latin.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const inter = localFont({
  src: "../../public/fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  keywords: [
    "creative developer",
    "frontend engineer",
    "webgl",
    "interaction design",
    "Next.js",
    "GSAP",
  ],
  openGraph: {
    type: "website",
    title: `${site.name} · ${site.role}`,
    description: site.description,
    url: siteUrl,
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-obsidian font-sans text-ivory antialiased">
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ivory focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-obsidian"
        >
          Skip to content
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
        <SmoothScroll />
        <CustomCursor />
        <EyeTrackerPet />
      </body>
    </html>
  );
}
