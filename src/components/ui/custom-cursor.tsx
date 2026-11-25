"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only custom cursor. Two elements, one instant and one with lag.
 * Hidden by CSS on touch pointers and under reduced motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    document.documentElement.dataset.cursor = "on";

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) {
      return () => {
        delete document.documentElement.dataset.cursor;
      };
    }

    const point = { x: -100, y: -100 };
    const ringPoint = { x: -100, y: -100 };
    let raf = 0;

    const move = (event: PointerEvent) => {
      point.x = event.clientX;
      point.y = event.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const over = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      ring.dataset.active = String(
        Boolean(target.closest("a, button, summary, [data-cursor-hover]")),
      );
    };

    const leave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const loop = () => {
      ringPoint.x += (point.x - ringPoint.x) * 0.16;
      ringPoint.y += (point.y - ringPoint.y) * 0.16;
      dot.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPoint.x}px, ${ringPoint.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      delete document.documentElement.dataset.cursor;
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
