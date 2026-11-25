"use client";

/*
 * Eye tracker, from Bencho (MIT). https://bencho.dev/blocks/eye-tracker
 * Source: https://bencho.dev/r/eye-tracker.json
 *
 * Changed from the block: its token sheet import (the two fill variables are
 * mapped in watcher.css), the bubble is decorative rather than a live region
 * so it does not read letter by letter, the ball is a focusable button for
 * keyboard visitors, and the accent tints are the site's. The eye geometry,
 * the spring and the bubble behaviour are the block's own.
 */

import type { CSSProperties } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "./watcher.css";

/* ══ THE EYES ARE ON THE BALL, NOT IN FRONT OF IT ═══════════
   Each eye is a point on the sphere's surface: looking left turns the
   ball, so an eye travels along the curve, and the one heading for the
   rim narrows as it turns away while the other swings wide. */
const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const R = 50; /* the ball's radius, in the 100-unit viewBox */

type Eye = { w: number; h: number; r: number };

const STYLES: Record<string, Eye> = {
  Slant: { w: 9, h: 15, r: 4.5 },
  Dots: { w: 11, h: 11, r: 5.5 },
  Squares: { w: 12, h: 12, r: 3.5 },
};
/* half the gap between the eyes, as a fraction of the radius */
const GAP = 0.19;
/* how far a look to a corner tilts the pair, in degrees at the rim */
const TILT = 64;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const LINES = [
  "Hey, I see you.",
  "Boop.",
  "That tickles.",
  "Hi there!",
  "Stop poking me.",
  "I'm watching you.",
  "Again? Okay.",
  "You found me.",
];
const TINTS = ["#9b6cff", "#ff4797"];
const KEY_MS = 38;
const HOLD_MS = 1500;

const SHAPES: Record<string, string> = {
  Ball: "M50 0 A50 50 0 1 1 49.99 0 Z",
  Circle: "M50 7 A43 43 0 1 1 49.99 7 Z",
  Cube: "M30 6 H70 A24 24 0 0 1 94 30 V70 A24 24 0 0 1 70 94 H30 A24 24 0 0 1 6 70 V30 A24 24 0 0 1 30 6 Z",
  Pill: "M34 17 H66 A33 33 0 0 1 66 83 H34 A33 33 0 0 1 34 17 Z",
  Hexagon:
    "M59.53 8.50 L81.18 21.00 Q90.70 26.50 90.70 37.50 L90.70 62.50 Q90.70 73.50 81.18 79.00 L59.53 91.50 Q50.00 97.00 40.47 91.50 L18.82 79.00 Q9.30 73.50 9.30 62.50 L9.30 37.50 Q9.30 26.50 18.82 21.00 L40.47 8.50 Q50.00 3.00 59.53 8.50 Z",
  "Hex flat":
    "M91.50 59.53 L79.00 81.18 Q73.50 90.70 62.50 90.70 L37.50 90.70 Q26.50 90.70 21.00 81.18 L8.50 59.53 Q3.00 50.00 8.50 40.47 L21.00 18.82 Q26.50 9.30 37.50 9.30 L62.50 9.30 Q73.50 9.30 79.00 18.82 L91.50 40.47 Q97.00 50.00 91.50 59.53 Z",
};

/* Shapes are different kinds of path, so they morph as their distance from
   the centre at evenly spaced angles, measured once and kept. */
const RAYS = 120;
const radii = new Map<string, number[]>();

function measure(shape: string): number[] {
  const hit = radii.get(shape);
  if (hit) return hit;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", SHAPES[shape] ?? SHAPES.Ball);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const pt = svg.createSVGPoint();
  const out: number[] = [];
  for (let i = 0; i < RAYS; i++) {
    const a = (i / RAYS) * Math.PI * 2 - Math.PI / 2;
    let lo = 0;
    let hi = 60;
    for (let k = 0; k < 16; k++) {
      const mid = (lo + hi) / 2;
      pt.x = 50 + Math.cos(a) * mid;
      pt.y = 50 + Math.sin(a) * mid;
      if (path.isPointInFill(pt)) lo = mid;
      else hi = mid;
    }
    out.push(lo);
  }
  svg.remove();
  radii.set(shape, out);
  return out;
}

function outline(r: number[]): string {
  let d = "";
  r.forEach((v, i) => {
    const a = (i / r.length) * Math.PI * 2 - Math.PI / 2;
    d += `${i ? "L" : "M"}${(50 + Math.cos(a) * v).toFixed(2)} ${(50 + Math.sin(a) * v).toFixed(2)}`;
  });
  return d + "Z";
}

export function Watcher({
  /* how far the ball turns toward the pointer, 0..100 */
  follow = 60,
  /* how much the turn overshoots and settles, 0..100 */
  bounce = 30,
  size = 100,
  shape = "Cube",
  eyes: look = "Slant",
  /* the eyes' size against the body */
  eyeScale = 1,
  /* the eyes' width on its own */
  eyeWidth = 1,
  /* how round the eyes' corners are, 1 fully round */
  eyeRound = 1,
  /* the eyes' height on its own */
  eyeHeight = 1,
  /* a mark rather than a toy: no pointer, a glance every five seconds */
  idle = false,
  /* the box it watches inside, as a selector */
  within,
}: {
  follow?: number;
  bounce?: number;
  size?: number;
  shape?: string;
  eyes?: string;
  eyeScale?: number;
  eyeWidth?: number;
  eyeRound?: number;
  eyeHeight?: number;
  idle?: boolean;
  within?: string;
} = {}) {
  const still = stillness();
  const box = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [talking, setTalking] = useState(false);
  const [tint, setTint] = useState(TINTS[0]);
  const turn = useRef(0);
  const lastLine = useRef(-1);
  useEffect(
    () => () => {
      turn.current++;
    },
    [],
  );
  const poke = async () => {
    if (idle) return;
    const mine = ++turn.current;
    const pool = LINES.map((_, i) => i).filter((i) => i !== lastLine.current);
    const i = pool[Math.floor(Math.random() * pool.length)];
    lastLine.current = i;
    const line = LINES[i];
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    setTint(TINTS[Math.floor(Math.random() * TINTS.length)]);
    setTyped("");
    setTalking(true);
    for (let k = 1; k <= line.length; k++) {
      await wait(KEY_MS + Math.random() * 30);
      if (mine !== turn.current) return;
      setTyped(line.slice(0, k));
    }
    await wait(HOLD_MS);
    if (mine !== turn.current) return;
    setTalking(false);
  };
  const eyes = useRef<(SVGGElement | null)[]>([]);
  const knobs = useRef({ follow, bounce, eyeScale });
  /* eslint-disable-next-line react-hooks/refs -- the frame loop reads the current knobs; state would re-render per pointer move */
  knobs.current = { follow, bounce, eyeScale };
  const base = STYLES[look] ?? STYLES.Slant;
  const eye = {
    w: base.w * eyeScale * eyeWidth,
    h: base.h * eyeScale * eyeHeight,
    r: base.r * eyeScale * eyeWidth * eyeRound,
  };
  const eyeNow = useRef(eye);
  /* eslint-disable-next-line react-hooks/refs -- read by the frame loop, never during render output */
  eyeNow.current = eye;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const t = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    let raf = 0;
    let prev = 0;
    let blink = 0;
    let nextBlink = performance.now() + 2200;

    const draw = (now: number) => {
      let lid = 1;
      if (now > nextBlink) {
        blink = now;
        nextBlink = now + (idle ? 2000 : 2600 + Math.random() * 3200);
      }
      const since = now - blink;
      if (since < 160) lid = 1 - 0.9 * Math.sin((since / 160) * Math.PI);

      const as = (v: number) => Math.asin(clamp(v, -0.92, 0.92));
      const yaw = as(t.x);
      const pitch = -as(t.y);
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const tilt = TILT * t.x * t.y;
      const g0 = GAP * Math.max(1, knobs.current.eyeScale * 0.8);

      [-g0, g0].forEach((x0, i) => {
        const g = eyes.current[i];
        if (!g) return;
        const z0 = Math.sqrt(1 - x0 * x0);
        const x1 = x0 * cy + z0 * sy;
        const z1 = -x0 * sy + z0 * cy;
        const y2 = -z1 * sp;
        const z2 = z1 * cp;
        const near = clamp(z2, 0, 1);
        const k = 0.45 + 0.55 * near;
        const sx = k * (0.7 + 0.3 * near);
        const e0 = eyeNow.current;
        const w = e0.w * sx;
        const h = Math.max(0.6, e0.h * k * lid);
        const rect = g.firstElementChild as SVGRectElement | null;
        if (rect) {
          rect.setAttribute("x", (-w / 2).toFixed(2));
          rect.setAttribute("y", (-h / 2).toFixed(2));
          rect.setAttribute("width", w.toFixed(2));
          rect.setAttribute("height", h.toFixed(2));
          rect.setAttribute("rx", Math.min(e0.r, w / 2, h / 2).toFixed(2));
        }
        g.setAttribute(
          "transform",
          `translate(${(50 + x1 * R).toFixed(2)} ${(50 + y2 * R).toFixed(2)}) rotate(${tilt.toFixed(2)})`,
        );
        g.style.opacity = z2 < 0.05 ? "0" : "1";
      });
    };

    let seen = true;
    const tick = (now: number) => {
      if (!seen || document.hidden) {
        raf = 0;
        prev = 0;
        return;
      }
      const dt = prev ? Math.min(2.5, (now - prev) / 16.67) : 1;
      prev = now;
      if (still) {
        t.x = t.tx;
        t.y = t.ty;
      } else {
        const k = 0.06;
        const d = 0.34 - (clamp(knobs.current.bounce, 0, 100) / 100) * 0.22;
        t.vx += ((t.tx - t.x) * k - t.vx * d) * dt;
        t.vy += ((t.ty - t.y) * k - t.vy * d) * dt;
        t.x += t.vx * dt;
        t.y += t.vy * dt;
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const resume = () => {
      if (!raf && seen && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      resume();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", resume);
    const unwatch = () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
    };

    const frame =
      el.closest<HTMLElement>(within ?? ".bench-card, .dtl-block, .board, .sf-thumb") ?? el;
    const aim = (e: PointerEvent) => {
      const f = frame.getBoundingClientRect();
      if (
        e.clientX < f.left ||
        e.clientX > f.right ||
        e.clientY < f.top ||
        e.clientY > f.bottom
      ) {
        t.tx = 0;
        t.ty = 0;
        return;
      }
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.max(60, Math.min(f.width, f.height) * 0.28);
      const far = Math.min(
        0.85,
        Math.tanh(d / reach) * (clamp(knobs.current.follow, 0, 100) / 100) * 1.5,
      );
      t.tx = (dx / d) * far;
      t.ty = (dy / d) * far;
    };
    const rest = () => {
      t.tx = 0;
      t.ty = 0;
    };

    /* idle: straight ahead, and now and then a glance */
    if (idle) {
      let glance = 0;
      const look = () => {
        const a = Math.random() * Math.PI * 2;
        const far = 0.45 + Math.random() * 0.25;
        t.tx = Math.cos(a) * far;
        t.ty = Math.sin(a) * far;
        glance = window.setTimeout(() => {
          rest();
          glance = window.setTimeout(look, 5000 - 900);
        }, 900);
      };
      glance = window.setTimeout(look, 5000);
      return () => {
        cancelAnimationFrame(raf);
        unwatch();
        window.clearTimeout(glance);
      };
    }

    window.addEventListener("pointermove", aim, { passive: true });
    document.documentElement.addEventListener("pointerleave", rest);
    return () => {
      cancelAnimationFrame(raf);
      unwatch();
      window.removeEventListener("pointermove", aim);
      document.documentElement.removeEventListener("pointerleave", rest);
    };
  }, [still, idle, within]);

  const s = clamp(size, 16, 180);
  const body = SHAPES[shape] ?? SHAPES.Ball;
  const clip = `eyt-clip-${useId().replace(/:/g, "")}`;

  const bodyEl = useRef<SVGPathElement>(null);
  const clipEl = useRef<SVGPathElement>(null);
  const shown = useRef<number[] | null>(null);
  const from = useRef(shape);
  useLayoutEffect(() => {
    if (from.current === shape) return;
    const start = shown.current ?? measure(from.current);
    const end = measure(shape);
    from.current = shape;
    if (still) {
      shown.current = end;
      const d = outline(end);
      bodyEl.current?.setAttribute("d", d);
      clipEl.current?.setAttribute("d", d);
      return;
    }
    const t0 = performance.now();
    const ms = 520;
    let raf = 0;
    const step = (now: number) => {
      const u = Math.min(1, (now - t0) / ms);
      const c = 1.3;
      const e = 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2);
      const r = start.map((a, i) => a + (end[i] - a) * e);
      shown.current = r;
      const d = outline(r);
      bodyEl.current?.setAttribute("d", d);
      clipEl.current?.setAttribute("d", d);
      if (u < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shape, still]);

  return (
    <div
      className="eyt"
      ref={box}
      style={{ "--eyt-size": `${s}px` } as CSSProperties}
    >
      <svg
        className="eyt-ball"
        viewBox="0 0 100 100"
        data-poke={idle ? undefined : true}
        onClick={poke}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            void poke();
          }
        }}
        tabIndex={idle ? undefined : 0}
        role="button"
        aria-label="Poke the pet"
      >
        <defs>
          <clipPath id={clip}>
            <path ref={clipEl} d={body} />
          </clipPath>
        </defs>
        <path ref={bodyEl} className="eyt-body" d={body} />
        <g clipPath={`url(#${clip})`}>
          {[0, 1].map((i) => (
            <g
              key={i}
              ref={(n) => {
                eyes.current[i] = n;
              }}
            >
              <rect
                className="eyt-eye"
                x={-eye.w / 2}
                y={-eye.h / 2}
                width={eye.w}
                height={eye.h}
                rx={eye.r}
              />
            </g>
          ))}
        </g>
      </svg>
      {idle ? null : (
        <span
          className="eyt-say"
          data-on={talking || undefined}
          style={{ "--tint": tint } as CSSProperties}
          aria-hidden="true"
        >
          <span>{typed}</span>
          <span className="eyt-caret" />
        </span>
      )}
    </div>
  );
}
