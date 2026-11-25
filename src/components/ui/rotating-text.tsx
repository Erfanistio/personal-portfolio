"use client";

import { useEffect, useState } from "react";
import { SpecialText } from "@/components/ui/special-text";
import { cn } from "@/lib/utils";

interface RotatingTextProps {
  variants: string[];
  interval?: number;
  className?: string;
}

/**
 * Cycles a phrase through Spell's scramble decode. The rotation itself is
 * paused when the visitor prefers reduced motion, in which case the first
 * variant stays put.
 */
export function RotatingText({ variants, interval = 5000, className }: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced || variants.length <= 1) return;

    const id = window.setInterval(() => {
      setStarted(true);
      setIndex((current) => (current + 1) % variants.length);
    }, interval);

    return () => window.clearInterval(id);
  }, [interval, reduced, variants.length]);

  return (
    <span className={cn("inline-block align-baseline", className)}>
      <span key={index} className="rotator-in inline-block">
        {started ? (
          <SpecialText speed={16}>{variants[index]}</SpecialText>
        ) : (
          variants[0]
        )}
      </span>
    </span>
  );
}

export default RotatingText;
