"use client";

import { useEffect, useRef } from "react";
import { ensureLastoria } from "@/lib/lastoria";
import styles from "./particle-mark.module.css";

/* ── Dots that hold a name ────────────────────────────────────────────────
   Adapted from Bencho's Particles block (MIT, bencho.dev/blocks/particles).
   The spring, the sampling and the speed stretch are theirs. The shape is
   not: the swarm settles into Erfan's name, rasterised from the self hosted
   Lastoria face, so the mark is the type itself. Move through it and the
   letters give way; press it and the dots break apart, then find their way
   home. Pointer only, decorative, hidden from assistive tech. */

const W = 700;
const H = 240;
const N = 900;
const PAD = 16;
const FALLBACK_STACK = "ui-sans-serif, system-ui, sans-serif";

type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };
type Point = [number, number];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* Scatter the candidate points before taking a share, so the dots spread
   through the letters instead of marching down the scan rows. */
function scatter(pool: Point[]): Point[] {
  let seed = 0x9e3779b9;
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    const swap = pool[i];
    pool[i] = pool[j];
    pool[j] = swap;
  }
  return pool;
}

/* Draw the name once, read the pixels back, and keep a point wherever the
   glyphs are solid. If the font cannot load, the system face stands in. */
async function wordHomes(text: string): Promise<Point[]> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  let family = FALLBACK_STACK;
  try {
    family = `"${await ensureLastoria()}"`;
  } catch {
    family = FALLBACK_STACK;
  }

  const at = (size: number) => `600 ${size}px ${family}`;
  ctx.font = at(100);
  const natural = ctx.measureText(text).width || 1;
  let size = Math.min(100, ((W - PAD * 2) / natural) * 100);

  ctx.font = at(size);
  let metrics = ctx.measureText(text);
  const tall = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  if (tall > H - PAD * 2) {
    size *= (H - PAD * 2) / tall;
    ctx.font = at(size);
    metrics = ctx.measureText(text);
  }

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    text,
    W / 2,
    H / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2,
  );

  const { data } = ctx.getImageData(0, 0, W, H);
  const pool: Point[] = [];
  const step = 2;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 110) pool.push([x, y]);
    }
  }

  if (!pool.length) return [];
  return scatter(pool).slice(0, Math.min(N, pool.length));
}

export function ParticleMark({
  text = "Erfan",
  reach = 92,
  force = 58,
}: {
  text?: string;
  reach?: number;
  force?: number;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* The whole swarm lives in this effect: the dots are plain data moved by
     requestAnimationFrame, and the pointer listeners are attached to the
     canvas directly, so nothing imperative leaks into render. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const radius = clamp(reach, 30, 160);
    const strength = (clamp(force, 0, 100) / 100) * 11;
    const shock = 0.4 + (clamp(force, 0, 100) / 100) * 1.2;

    let dots: Dot[] = [];
    let hand: { x: number; y: number } | null = null;
    let raf = 0;
    let prev = 0;
    let gone = false;

    const draw = () => {
      const k = canvas.width / W;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#f3f1ea";
      const r = 1.9;
      ctx.beginPath();
      for (const d of dots) {
        const speed = Math.hypot(d.vx, d.vy);
        if (speed < 0.3) {
          ctx.moveTo(d.x + r, d.y);
          ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        } else {
          /* long along its path, a little thin across it */
          const stretch = Math.min(2.8, 1 + speed * 0.12);
          const rot = Math.atan2(d.vy, d.vx);
          ctx.moveTo(d.x + Math.cos(rot) * r * stretch, d.y + Math.sin(rot) * r * stretch);
          ctx.ellipse(d.x, d.y, r * stretch, r / Math.sqrt(stretch), rot, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    };

    const run = () => {
      if (raf || gone) return;
      const tick = (t: number) => {
        const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
        prev = t;
        let busy = Boolean(hand);
        for (const d of dots) {
          if (hand) {
            const dx = d.x - hand.x;
            const dy = d.y - hand.y;
            const dd = Math.hypot(dx, dy);
            if (dd < radius && dd > 0.01) {
              const f = Math.pow(1 - dd / radius, 2) * strength;
              d.vx += (dx / dd) * f * dt;
              d.vy += (dy / dd) * f * dt;
            }
          }
          d.vx = (d.vx + (d.hx - d.x) * 0.05 * dt) * Math.pow(0.84, dt);
          d.vy = (d.vy + (d.hy - d.y) * 0.05 * dt) * Math.pow(0.84, dt);
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          if (
            Math.abs(d.hx - d.x) < 0.05 &&
            Math.abs(d.hy - d.y) < 0.05 &&
            Math.abs(d.vx) < 0.02 &&
            Math.abs(d.vy) < 0.02
          ) {
            d.x = d.hx;
            d.y = d.hy;
            d.vx = 0;
            d.vy = 0;
          } else {
            busy = true;
          }
        }
        draw();
        raf = busy ? requestAnimationFrame(tick) : 0;
      };
      raf = requestAnimationFrame(tick);
    };

    const where = (event: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const k = rect.width / W;
      return { x: (event.clientX - rect.left) / k, y: (event.clientY - rect.top) / k };
    };

    const move = (event: PointerEvent) => {
      if (still || event.pointerType !== "mouse") return;
      hand = where(event);
      run();
    };

    const leave = () => {
      hand = null;
      run();
    };

    const press = (event: MouseEvent) => {
      if (still) return;
      const p = where(event);
      for (const d of dots) {
        const dx = d.x - p.x;
        const dy = d.y - p.y;
        const dd = Math.hypot(dx, dy);
        if (dd > 210 || dd < 0.01) continue;
        const f = (1 - dd / 210) * 30 * shock;
        d.vx += (dx / dd) * f;
        d.vy += (dy / dd) * f;
      }
      run();
    };

    canvas.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointercancel", leave);
    canvas.addEventListener("click", press);

    void wordHomes(text).then((homes) => {
      if (gone || !homes.length) return;

      /* First arrival: every dot is thrown into the frame, then reeled in,
         so the name assembles out of dust rather than arriving finished. */
      dots = homes.map(([x, y]) => {
        const angle = Math.random() * Math.PI * 2;
        const away = 30 + Math.random() * 300;
        return {
          hx: x,
          hy: y,
          x: W / 2 + Math.cos(angle) * away,
          y: H / 2 + Math.sin(angle) * away * 0.6,
          vx: 0,
          vy: 0,
        };
      });

      if (still) {
        for (const d of dots) {
          d.x = d.hx;
          d.y = d.hy;
        }
      }

      draw();
      run();
    });

    return () => {
      gone = true;
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointercancel", leave);
      canvas.removeEventListener("click", press);
    };
  }, [text, reach, force]);

  return (
    <div className={styles.word} aria-hidden="true">
      <span className={styles.glow} />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-cursor-hover=""
        width={W}
        height={H}
        role="presentation"
      />
    </div>
  );
}
