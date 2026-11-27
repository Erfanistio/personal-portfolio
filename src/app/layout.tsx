import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-sy-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sy-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Erfan Akrami | Frontend Developer & Product Designer",
  description:
    "Portfolio of Erfan Akrami, Frontend Developer and Product Designer crafting Next.js interfaces, design systems, and kinetic web products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
