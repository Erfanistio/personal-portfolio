import type { Metadata } from "next";
import { Component } from "@/components/ui/sterling-gate-kinetic-navigation";

export const metadata: Metadata = {
  title: "Kinetic navigation",
  description: "Standalone demo of the Sterling Gate kinetic navigation.",
};

export default function DemoOne() {
  return (
    <main className="min-h-dvh bg-obsidian">
      <Component />

      <section className="shell flex min-h-dvh flex-col justify-center py-40">
        <p className="eyebrow">Component demo</p>
        <h1 className="display-lg mt-6 max-w-3xl">
          Sterling Gate kinetic navigation
        </h1>
        <p className="body-lg mt-6 max-w-xl">
          Open the menu in the top right. Five ambient shapes answer the five
          menu entries, and the panel arrives in stacked layers.
        </p>
      </section>
    </main>
  );
}
