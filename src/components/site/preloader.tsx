"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PixelLoader } from "@/components/ui/pixel-loader";
import { ensureLastoria } from "@/lib/lastoria";
import styles from "./preloader.module.css";

/* Show once per document. A client side navigation back to the home page
   should not replay the curtain, and a Strict Mode remount must not leave a
   frozen curtain behind, so only a finished run counts. */
let finished = false;

const MIN_MS = 1250;
const HERO_WAIT_MS = 2600;
const HARD_STOP_MS = 7000;

/**
 * A real loading beat, not a fake timer: it holds until the fonts are ready,
 * the Lastoria outlines behind the hero wordmark have downloaded, the
 * document (scripts, styles, shader chunk) has loaded and the hero shader has
 * produced its first frame. The pixel mark is the only thing on screen; the
 * curtain lifts once that work is done and the mark has finished drawing.
 */
export function Preloader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">(() =>
    finished ? "gone" : "loading",
  );
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const builtRef = useRef(false);

  const handleBuilt = useCallback(() => {
    builtRef.current = true;
  }, []);

  useEffect(() => {
    if (finished) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const min = reduced ? 400 : MIN_MS;
    const started = performance.now();
    const tasks = { fonts: false, load: false, hero: false, mark: false };
    const timers: number[] = [];
    let raf = 0;
    let alive = true;

    document.documentElement.dataset.preloading = "";

    const leave = () => {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      delete document.documentElement.dataset.preloading;
      finished = true;
      setPhase("leaving");
      timers.push(window.setTimeout(() => setPhase("gone"), reduced ? 160 : 1000));
    };

    const tick = (now: number) => {
      if (!alive) return;
      const loaded = tasks.fonts && tasks.load && tasks.hero && tasks.mark;

      if (loaded && !readyRef.current) {
        readyRef.current = true;
        setReady(true);
      }

      /* The pixel mark draws itself for its own duration, so the curtain
         waits for it as well instead of lifting over a half built shape. */
      if (loaded && builtRef.current && now - started >= min) {
        leave();
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    if (document.fonts) {
      void document.fonts.ready.then(() => {
        tasks.fonts = true;
      });
    } else {
      tasks.fonts = true;
    }

    /* The hero wordmark is drawn from the Lastoria outlines, so its file is
       part of the load, not a late request after the curtain.
       Both outcomes settle the task; a missing font must not stall the page. */
    void ensureLastoria().then(
      () => {
        tasks.mark = true;
      },
      () => {
        tasks.mark = true;
      },
    );

    if (document.readyState === "complete") {
      tasks.load = true;
    } else {
      window.addEventListener(
        "load",
        () => {
          tasks.load = true;
        },
        { once: true },
      );
    }

    /* Wait for the WebGL canvas the Wayglim engine appends to the hero. If
       the shader never arrives, do not hold the page hostage. A canvas that
       measures zero would be painted before layout, so width is the test. */
    const heroStarted = performance.now();
    const lookForHero = () => {
      const canvas = document.querySelector<HTMLCanvasElement>("[data-wayglim] canvas");
      if (canvas && canvas.width > 0) {
        requestAnimationFrame(() => {
          tasks.hero = true;
        });
        return;
      }
      if (performance.now() - heroStarted > HERO_WAIT_MS) {
        tasks.hero = true;
        return;
      }
      timers.push(window.setTimeout(lookForHero, 90));
    };
    lookForHero();

    /* Last resort: a stalled asset never leaves a visitor behind a curtain. */
    timers.push(
      window.setTimeout(() => {
        tasks.fonts = true;
        tasks.load = true;
        tasks.hero = true;
        tasks.mark = true;
        builtRef.current = true;
      }, HARD_STOP_MS),
    );

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
      delete document.documentElement.dataset.preloading;
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      data-preloader=""
      data-phase={phase}
      className={styles.root}
      role="status"
      aria-live="polite"
      aria-label="Loading the site"
    >
      <div className={styles.inner}>
        <PixelLoader onBuilt={handleBuilt} contentReady={ready} pixelColor="#F3F1EA" />
      </div>
    </div>
  );
}
