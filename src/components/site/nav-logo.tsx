"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const EYE = { w: 9, h: 12, rx: 4.5 };
const EYES = [
  { x: 12.5, y: 18 },
  { x: 26.5, y: 18 },
];
const MAX_SHIFT = 2.8;

/**
 * The nav mark: two eyes in an ivory disc. They follow the pointer, and a click
 * shuts them for a beat before they open again. The whole mark is the link home.
 */
export function NavLogo({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const eyesRef = useRef<(SVGGElement | null)[]>([]);
  const shutTimer = useRef<number | null>(null);
  const [shut, setShut] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let prev = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const aim = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const reach = Math.max(70, Math.min(window.innerWidth, window.innerHeight) * 0.26);
      const pull = Math.min(1, Math.tanh(distance / reach) * 1.7);
      target.x = (dx / distance) * MAX_SHIFT * pull;
      target.y = (dy / distance) * MAX_SHIFT * pull;
    };

    const rest = () => {
      target.x = 0;
      target.y = 0;
    };

    const loop = (now: number) => {
      const dt = prev ? Math.min(2.5, (now - prev) / 16.67) : 1;
      prev = now;
      current.x += (target.x - current.x) * Math.min(1, 0.16 * dt);
      current.y += (target.y - current.y) * Math.min(1, 0.16 * dt);

      for (const eye of eyesRef.current) {
        eye?.setAttribute(
          "transform",
          `translate(${current.x.toFixed(2)} ${current.y.toFixed(2)})`,
        );
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", aim, { passive: true });
    document.documentElement.addEventListener("pointerleave", rest);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", aim);
      document.documentElement.removeEventListener("pointerleave", rest);
    };
  }, []);

  useEffect(
    () => () => {
      if (shutTimer.current) window.clearTimeout(shutTimer.current);
    },
    [],
  );

  function closeEyes() {
    setShut(true);
    if (shutTimer.current) window.clearTimeout(shutTimer.current);
    shutTimer.current = window.setTimeout(() => {
      setShut(false);
      shutTimer.current = null;
    }, 1800);
  }

  return (
    <a
      ref={rootRef}
      href="#top"
      onClick={() => {
        closeEyes();
        onNavigate?.();
      }}
      className={cn(
        "group flex items-center gap-2.5 font-display text-xl font-medium tracking-tight md:text-2xl",
        className,
      )}
      aria-label={`${site.name}, back to top`}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-ivory text-obsidian transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-[1.06] md:h-14 md:w-14">
        <svg viewBox="0 0 48 48" className="h-8 w-8 md:h-9 md:w-9" aria-hidden="true">
          {EYES.map((eye, index) => (
            <g
              key={eye.x}
              ref={(node) => {
                eyesRef.current[index] = node;
              }}
            >
              <rect
                x={eye.x}
                y={eye.y}
                width={EYE.w}
                height={EYE.h}
                rx={EYE.rx}
                fill="#111315"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: shut ? "scaleY(0.14)" : "scaleY(1)",
                  transition: "transform 180ms cubic-bezier(0.24, 1.34, 0.38, 1)",
                }}
              />
            </g>
          ))}
        </svg>
      </span>
      <span className="hidden items-baseline sm:inline-flex">
        {site.firstName}
        <span className="text-violet">.</span>
      </span>
    </a>
  );
}
