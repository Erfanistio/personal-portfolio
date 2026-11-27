"use client";

import * as React from "react";
import gsap from "gsap";

export type SynapseToken =
  | string
  | { slot: "star" | "links" | "eye" | "coral" }
  | { box: string };

export interface SynapseAgent {
  name: string;
  color: string;
}

export interface SynapseFolioHeroProps {
  height?: string;
  brand?: string;
  lead?: SynapseToken[];
  body?: SynapseToken[];
  note?: string;
  noteTag?: string;
  essentially?: string;
  city?: string;
  timeZone?: string;
  agents?: SynapseAgent[];
  playIntro?: boolean;
  assetBase?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_LEAD: SynapseToken[] = [
  "I design",
  { slot: "star" },
  "systems that shape how",
  { box: "people and products" },
  "connect.",
  { slot: "links" },
];

const DEFAULT_BODY: SynapseToken[] = [
  "From design systems to kinetic interfaces, my work",
  { slot: "eye" },
  "lives at the intersection of",
  { slot: "coral" },
  "frontend code and product.",
];

const DEFAULT_AGENTS: SynapseAgent[] = [
  { name: "Scout", color: "#1F2FB0" },
  { name: "Weaver", color: "#5468FF" },
  { name: "Pilot", color: "#0B1240" },
  { name: "Relay", color: "#3346D8" },
];

const DEFAULT_ASSET_BASE =
  "https://kedhar-components.pages.dev/synapse-folio-template/";

const SY_CSS = `
.sy-root {
  --bg: #FBFBFE;
  --ink: #1F2FB0;
  --deep: #0B1240;
  --soft: #E9ECFB;
  --line: rgba(31, 47, 176, 0.14);
  --line2: rgba(31, 47, 176, 0.42);
  --paper: #ffffff;
  --g: clamp(16px, 2.2vw, 32px);
  --gap: clamp(20px, 4vw, 72px);
  --fs: clamp(30px, min(4.15vw, 6.6vh), 78px);
  position: relative;
  width: 100%;
  overflow-x: clip;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sy-mono), 'JetBrains Mono', ui-monospace, monospace;
}

:where(.dark) .sy-root {
  --bg: #080C26;
  --ink: #A9B6FF;
  --deep: #E6EAFF;
  --soft: #121948;
  --line: rgba(169, 182, 255, 0.13);
  --line2: rgba(169, 182, 255, 0.4);
  --paper: #0C1236;
}

.sy-hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  overflow: clip;
  --mx: 0;
  --my: 0;
}

.sy-guide {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--g) + (100% - 2 * var(--g) - var(--gap)) * 0.3 + var(--gap) / 2);
  width: 1px;
  background: var(--line);
  pointer-events: none;
  z-index: 1;
}

.sy-nav {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: var(--g) var(--g) 0;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.sy-brand {
  justify-self: start;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: inherit;
  text-decoration: none;
}

.sy-replay {
  justify-self: center;
  border: 1px solid var(--ink);
  border-radius: 2px;
  padding: 3px 9px;
  background: var(--paper);
  color: var(--ink);
  font: inherit;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: background-color 180ms ease, color 180ms ease;
}

.sy-replay:hover {
  background: var(--ink);
  color: var(--bg);
}

.sy-time {
  justify-self: end;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.35;
}

.sy-time span:first-child {
  opacity: 0.6;
}

.sy-main.sy-cols {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 30fr) minmax(0, 70fr);
  column-gap: var(--gap);
  flex: 1;
  padding: clamp(14px, 3vh, 36px) var(--g) 0;
  align-items: stretch;
}

.sy-boardwrap {
  container-type: inline-size;
  position: relative;
  min-width: 0;
}

.sy-board {
  position: relative;
  width: 100%;
  height: 153cqw;
}

.sy-obj {
  position: absolute;
}

.sy-par {
  transform: translate3d(
    calc(var(--mx) * var(--d, 0) * 1px),
    calc(var(--my) * var(--d, 0) * 1px),
    0
  );
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
  will-change: transform;
}

/* Selection frame & filename pill */
.sy-sel {
  position: relative;
  outline: 1px solid transparent;
  outline-offset: 5px;
  transition: outline-color 180ms ease;
}

.sy-tag {
  position: absolute;
  left: -5px;
  top: -22px;
  z-index: 12;
  pointer-events: none;
  opacity: 0;
  transform: translateY(3px);
  transition: opacity 160ms ease, transform 160ms ease;
  font: 500 10px/1 var(--font-sy-mono), 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.04em;
  background: var(--ink);
  color: var(--bg);
  padding: 4px 6px;
  white-space: nowrap;
}

@media (hover: hover) and (pointer: fine) {
  .sy-sel:hover {
    outline-color: var(--ink);
  }
  .sy-sel:hover > .sy-tag {
    opacity: 1;
    transform: translateY(0);
  }
}

.sy-sel[data-on="1"] {
  outline-color: var(--ink);
}
.sy-sel[data-on="1"] > .sy-tag {
  opacity: 1;
  transform: translateY(0);
}

.sy-root:not([data-phase="intro"]) [data-drag] {
  cursor: grab;
  touch-action: none;
}

.sy-root:not([data-phase="intro"]) [data-dragging] {
  cursor: grabbing;
  z-index: 15 !important;
}

/* 1. Grid / Dot Paper Panel */
.sy-gridpanel {
  left: 0;
  top: 9cqw;
  width: 100cqw;
  height: 91.67cqw;
  z-index: 1;
}

.sy-grid {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--line2);
  background-color: var(--paper);
  background-image:
    linear-gradient(var(--line2) 1px, transparent 1px),
    linear-gradient(90deg, var(--line2) 1px, transparent 1px);
  background-size: 8.333cqw 8.333cqw;
  background-position: -1px -1px;
  overflow: hidden;
  transition: background-image 200ms ease;
}

.sy-board[data-paper="dots"] .sy-grid {
  background-image: radial-gradient(circle, var(--line2) 1.2px, transparent 1.6px);
  background-size: 4.1667cqw 4.1667cqw;
  background-position: 0 0;
}

.sy-cell {
  position: absolute;
  left: 0;
  top: 0;
  background: var(--soft);
  opacity: 0;
  pointer-events: none;
  transition: transform 110ms ease-out, opacity 180ms ease;
}

/* 2. Top Floating Note Card */
.sy-note {
  left: 20cqw;
  top: 0;
  width: 56cqw;
  z-index: 5;
}

.sy-notecard {
  background: var(--paper);
  border: 1px solid var(--line2);
  border-radius: 2px;
  padding: 2.6cqw 3cqw 3.2cqw;
  display: flex;
  flex-direction: column;
  gap: 2.4cqw;
  font-size: clamp(9px, 2.75cqw, 12px);
  line-height: 1.35;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.sy-bars {
  display: flex;
  align-items: center;
  gap: 2cqw;
}

.sy-bar {
  flex: 1;
  height: 3.2cqw;
  border: 1px solid var(--ink);
  position: relative;
  overflow: hidden;
}

.sy-bar > i {
  display: block;
  height: 100%;
  background: var(--ink);
}

.sy-bars > b {
  width: 3.6cqw;
  height: 3.6cqw;
  border-radius: 50%;
  background: var(--ink);
  flex-shrink: 0;
}

.sy-notecard p {
  margin: 0;
}

.sy-notecard em {
  font-style: normal;
  border: 1px solid var(--ink);
  border-radius: 2px;
  padding: 0 3px;
}

/* 3. Etched Hand + Gizmo */
.sy-handobj {
  left: 0;
  top: 40cqw;
  width: 87cqw;
  z-index: 3;
}

.sy-handwrap {
  position: relative;
  width: 100%;
  aspect-ratio: 562 / 231;
}

.sy-handmask {
  position: absolute;
  inset: 0;
  background-color: var(--ink);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.sy-gizmo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 4. Horizontal Connector Wire */
.sy-wire {
  left: 87cqw;
  top: 45.6cqw;
  width: calc(13cqw + var(--gap) / 2);
  height: 1px;
  z-index: 2;
  background: var(--ink);
  transform-origin: left center;
}

.sy-wire > i {
  position: absolute;
  right: -1.6cqw;
  top: 50%;
  transform: translateY(-50%);
  width: 3.2cqw;
  height: 3.2cqw;
  border: 1px solid var(--ink);
  background: var(--paper);
}

.sy-wire > i::after {
  content: "";
  position: absolute;
  inset: 25%;
  background: var(--ink);
}

/* 5. Lab Photo Window Card */
.sy-photo {
  left: 44cqw;
  top: 70cqw;
  width: 56cqw;
  z-index: 4;
}

.sy-win {
  border: 1px solid var(--ink);
  background: var(--paper);
  padding: 1.2cqw;
  box-shadow: 2cqw 2cqw 0 var(--soft);
}

.sy-winbar {
  height: 3cqw;
  border-bottom: 1px solid var(--line2);
  margin-bottom: 1.2cqw;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 0.6cqw;
}

.sy-winbar > i {
  display: block;
  width: 2.2cqw;
  height: 2.2cqw;
  border: 1px solid var(--ink);
}

.sy-win img {
  display: block;
  width: 100%;
  aspect-ratio: 740 / 484;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}

/* 6. Wireframe Globe */
.sy-globe {
  left: 8cqw;
  top: 118cqw;
  width: 34cqw;
  aspect-ratio: 1;
  z-index: 2;
}

.sy-globe-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Right Column Copy */
.sy-copy {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vh, 36px);
  padding-top: clamp(28px, 9vh, 120px);
  min-width: 0;
}

.sy-stmt {
  display: flex;
  flex-direction: column;
  gap: clamp(14px, 2.6vh, 30px);
  margin-bottom: auto;
}

.sy-h {
  margin: 0;
  font-family: var(--font-sy-serif), 'Source Serif 4', Georgia, serif;
  font-size: var(--fs);
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: -0.028em;
  color: var(--ink);
}

.sy-w {
  display: inline-block;
  margin-right: 0.22em;
}

.sy-box {
  display: inline;
  border: 1.5px solid var(--line2);
  border-radius: 0.12em;
  padding: 0 0.12em;
  margin-right: 0.22em;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.sy-box .sy-w:last-child {
  margin-right: 0;
}

.sy-slot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin: 0 0.2em 0.08em 0;
  height: 0.85em;
  position: relative;
}

.sy-slot-star {
  width: 1.08em;
}

.sy-slot-links {
  width: 1.3em;
}

.sy-slot-eye {
  width: 1.72em;
}

.sy-slot-coral {
  width: 1.16em;
}

.sy-pupil {
  transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.sy-coralmask {
  width: 100%;
  aspect-ratio: 522 / 418;
  background-color: var(--ink);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
}

.sy-p2row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.42fr);
  column-gap: clamp(16px, 2vw, 40px);
  align-items: center;
}

.sy-pair {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 18px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
}

.sy-armbox {
  position: relative;
  width: 100%;
  aspect-ratio: 1.9;
  border-radius: 2px;
  background: var(--ink);
  overflow: hidden;
}

.sy-armmask {
  position: absolute;
  left: -26%;
  top: 20%;
  width: 118%;
  aspect-ratio: 645 / 214;
  background-color: var(--bg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.sy-arrow {
  width: 18px;
  height: 9px;
}

.sy-bustmask {
  width: 100%;
  aspect-ratio: 434 / 451;
  background-color: var(--ink);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

/* Bottom Row */
.sy-foot {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  padding-bottom: var(--g);
}

.sy-toggle {
  height: 30px;
  border: 1px solid var(--ink);
  border-radius: 3px;
  overflow: hidden;
  background: var(--paper);
  display: flex;
  padding: 0;
}

.sy-tg-a,
.sy-tg-b {
  width: 46px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 180ms ease, color 180ms ease;
}

.sy-tg-a {
  background: var(--ink);
  color: var(--bg);
}

.sy-tg-b > span {
  display: block;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  border-radius: 2px;
  background-image: repeating-conic-gradient(var(--ink) 0 25%, transparent 0 50%);
  background-size: 6px 6px;
}

.sy-toggle[aria-pressed="true"] .sy-tg-a {
  background: transparent;
  color: var(--ink);
}

.sy-toggle[aria-pressed="true"] .sy-tg-b > span {
  outline: 5px solid var(--ink);
}

.sy-ess {
  position: relative;
  width: clamp(260px, 25vw, 390px);
  border: 1px solid var(--line2);
  background: var(--paper);
  padding: 12px 14px 14px;
}

.sy-ess-x {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 7px;
  height: 7px;
  border: 1px solid var(--ink);
}

.sy-ess-h {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.sy-ess-p {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.9;
}

/* Multiplayer Intro Overlay */
.sy-hands {
  position: absolute;
  inset: 0;
  z-index: 30;
  pointer-events: none;
  overflow: hidden;
}

.sy-hand-cur {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  will-change: transform, opacity;
}

.sy-cur-icon {
  display: block;
  width: 18px;
  height: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.22));
}

.sy-name {
  position: absolute;
  left: 14px;
  top: 14px;
  font: 500 11px/1 var(--font-sy-mono), 'JetBrains Mono', ui-monospace, monospace;
  padding: 4px 7px;
  border-radius: 2px;
  background: var(--c);
  color: #ffffff;
  white-space: nowrap;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.7);
}

.sy-key {
  position: absolute;
  left: 14px;
  top: -16px;
  font: 500 10px/1 var(--font-sy-mono), 'JetBrains Mono', ui-monospace, monospace;
  padding: 3px 5px;
  border-radius: 2px;
  background: var(--ink);
  color: var(--bg);
  opacity: 0;
  white-space: nowrap;
}

.sy-frm {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  border: 1px dashed var(--ink);
  background: rgba(31, 47, 176, 0.05);
  opacity: 0;
  pointer-events: none;
}

.sy-frm-dim {
  position: absolute;
  right: 0;
  bottom: -20px;
  font: 500 10px/1 var(--font-sy-mono), 'JetBrains Mono', ui-monospace, monospace;
  background: var(--ink);
  color: var(--bg);
  padding: 3px 5px;
  white-space: nowrap;
}

@media (max-width: 820px) {
  .sy-root {
    --fs: clamp(28px, 7.6vw, 44px);
  }
  .sy-guide {
    display: none;
  }
  .sy-main.sy-cols {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 28px;
  }
  .sy-copy {
    grid-row: 1;
    padding-top: 12px;
  }
  .sy-boardwrap {
    grid-row: 2;
    margin-bottom: var(--g);
  }
  .sy-p2row {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 22px;
  }
  .sy-pair {
    max-width: 420px;
  }
  .sy-foot {
    flex-direction: column;
    align-items: flex-start;
  }
  .sy-ess {
    width: 100%;
    max-width: 440px;
  }
  .sy-wire {
    width: 10cqw;
  }
  .sy-time span:first-child {
    display: none;
  }
}

@media (max-width: 400px) {
  .sy-rp-w {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sy-par,
  .sy-pupil,
  .sy-grid,
  .sy-cell {
    transition: none !important;
  }
}
`;

function renderTokens(
  tokens: SynapseToken[],
  assetBase: string,
  pupilRef: React.RefObject<SVGGElement | null>
) {
  return tokens.map((tok, idx) => {
    if (typeof tok === "string") {
      return tok.split(" ").map((word, wIdx) => (
        <span key={`${idx}-${wIdx}`} className="sy-w">
          {word}
        </span>
      ));
    }

    if ("box" in tok) {
      return (
        <span key={`box-${idx}`} className="sy-box">
          {tok.box.split(" ").map((word, wIdx) => (
            <span key={`bw-${idx}-${wIdx}`} className="sy-w">
              {word}
            </span>
          ))}
        </span>
      );
    }

    if (tok.slot === "star") {
      return (
        <span
          key={`slot-${idx}`}
          data-slot="star"
          className="sy-slot sy-slot-star sy-sel"
        >
          <span className="sy-tag">spark.svg</span>
          <svg
            viewBox="0 0 52 44"
            className="h-full w-full"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18 2C19.5 14 23 18.5 34 20C23 21.5 19.5 26 18 38C16.5 26 13 21.5 2 20C13 18.5 16.5 14 18 2Z" />
            <path d="M40 16C40.9 23 43 25.6 50 26.5C43 27.4 40.9 30 40 37C39.1 30 37 27.4 30 26.5C37 25.6 39.1 23 40 16Z" />
          </svg>
        </span>
      );
    }

    if (tok.slot === "links") {
      return (
        <span
          key={`slot-${idx}`}
          data-slot="links"
          className="sy-slot sy-slot-links sy-sel"
        >
          <span className="sy-tag">links.svg</span>
          <svg
            viewBox="0 0 64 40"
            className="h-full w-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            aria-hidden="true"
          >
            <rect
              x="6"
              y="10"
              width="30"
              height="18"
              rx="9"
              transform="rotate(-14 21 19)"
            />
            <rect
              x="28"
              y="12"
              width="30"
              height="18"
              rx="9"
              transform="rotate(-14 43 21)"
            />
          </svg>
        </span>
      );
    }

    if (tok.slot === "eye") {
      return (
        <span
          key={`slot-${idx}`}
          data-slot="eye"
          className="sy-slot sy-slot-eye sy-sel"
        >
          <span className="sy-tag">eye.svg</span>
          <svg
            viewBox="0 0 84 40"
            className="h-full w-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            aria-hidden="true"
          >
            <path d="M4 20C18 4 66 4 80 20C66 36 18 36 4 20Z" />
            <g ref={pupilRef} className="sy-pupil">
              <circle cx="42" cy="20" r="10" fill="currentColor" />
              <circle cx="45" cy="17" r="2.6" fill="var(--bg)" stroke="none" />
            </g>
          </svg>
        </span>
      );
    }

    return (
      <span
        key={`slot-${idx}`}
        data-slot="coral"
        className="sy-slot sy-slot-coral sy-sel"
      >
        <span className="sy-tag">coral.webp</span>
        <span
          className="sy-coralmask"
          style={{
            WebkitMaskImage: `url(${assetBase}coral.webp)`,
            maskImage: `url(${assetBase}coral.webp)`,
          }}
        />
      </span>
    );
  });
}

export default function SynapseFolioHero({
  height = "100svh",
  brand = "ERFAN AKRAMI",
  lead = DEFAULT_LEAD,
  body = DEFAULT_BODY,
  note = "BUILDING INTERFACES BETWEEN PEOPLE AND PRODUCTS",
  noteTag = "CRAFTED",
  essentially = "MY JOB IS TO HELP TEAMS SHIP INTERFACES PEOPLE TRUST: CLEAN NEXT.JS ARCHITECTURE, EXPRESSIVE MOTION SYSTEMS, AND PRODUCT DESIGN BUILT IN REAL CODE.",
  city = "THR",
  timeZone = "Asia/Tehran",
  agents = DEFAULT_AGENTS,
  playIntro = true,
  assetBase = DEFAULT_ASSET_BASE,
  className,
  style,
}: SynapseFolioHeroProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const heroRef = React.useRef<HTMLElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const cellRef = React.useRef<HTMLElement>(null);
  const pupilRef = React.useRef<SVGGElement>(null);
  const globeRef = React.useRef<SVGSVGElement>(null);
  const tlRef = React.useRef<gsap.core.Timeline | null>(null);

  const [paper, setPaper] = React.useState<"grid" | "dots">("grid");
  const [phase, setPhase] = React.useState<"intro" | "settled">("settled");
  const [runId, setRunId] = React.useState(0);
  const [clock, setClock] = React.useState("");

  const mxRef = React.useRef(0);

  // Live local time clock
  React.useEffect(() => {
    const update = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone,
        }).format(new Date());
        setClock(`${city} ${formatted}`);
      } catch {
        setClock(`${city} LIVE`);
      }
    };
    update();
    const id = window.setInterval(update, 20000);
    return () => window.clearInterval(id);
  }, [city, timeZone]);

  // Continuous wireframe globe meridian spin (paused off-screen or reduced motion)
  React.useEffect(() => {
    const hero = heroRef.current;
    const svg = globeRef.current;
    if (!hero || !svg) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const meridians = Array.from(svg.querySelectorAll<SVGEllipseElement>(".sy-mer"));
    let raf = 0;
    let visible = true;
    let phaseAngle = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const speed = 0.45 + mxRef.current * 0.9;
      phaseAngle += dt * speed;
      for (let i = 0; i < meridians.length; i++) {
        const rx = Math.max(1, Math.abs(Math.cos(phaseAngle + (i * Math.PI) / 4)) * 46);
        meridians[i].setAttribute("rx", rx.toFixed(2));
      }
      raf = visible ? window.requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1]?.isIntersecting ?? true;
      if (visible && !raf) {
        last = performance.now();
        raf = window.requestAnimationFrame(tick);
      }
    });
    io.observe(hero);
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // Pointer parallax + eye pupil tracking
  React.useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mxRef.current = nx;
      hero.style.setProperty("--mx", nx.toFixed(3));
      hero.style.setProperty("--my", ny.toFixed(3));

      const pupil = pupilRef.current;
      if (pupil) {
        const svg = pupil.ownerSVGElement;
        if (svg) {
          const er = svg.getBoundingClientRect();
          const dx = e.clientX - (er.left + er.width / 2);
          const dy = e.clientY - (er.top + er.height / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const clamped = Math.min(1, dist / 280);
          const px = (dx / dist) * 9 * clamped;
          const py = (dy / dist) * 4 * clamped;
          pupil.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
        }
      }
    };

    hero.addEventListener("pointermove", onMove, { passive: true });
    return () => hero.removeEventListener("pointermove", onMove);
  }, []);

  // Drag-and-drop + double-click reset on [data-drag] items
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const isFine =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;

    const draggables = Array.from(root.querySelectorAll<HTMLElement>("[data-drag]"));
    const cleanups: (() => void)[] = [];

    draggables.forEach((el) => {
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let baseX = 0;
      let baseY = 0;

      const onDown = (e: PointerEvent) => {
        if (root.getAttribute("data-phase") === "intro") return;
        dragging = true;
        el.setAttribute("data-dragging", "");
        el.setPointerCapture(e.pointerId);
        const saved = (el.dataset.off || "0,0").split(",").map(Number);
        baseX = saved[0] || 0;
        baseY = saved[1] || 0;
        startX = e.clientX;
        startY = e.clientY;
      };

      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const x = baseX + (e.clientX - startX);
        const y = baseY + (e.clientY - startY);
        el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        el.dataset.off = `${x.toFixed(1)},${y.toFixed(1)}`;
      };

      const onUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        el.removeAttribute("data-dragging");
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      };

      const onDblClick = () => {
        el.style.translate = "";
        delete el.dataset.off;
      };

      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      el.addEventListener("dblclick", onDblClick);

      cleanups.push(() => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        el.removeEventListener("dblclick", onDblClick);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // GSAP Multiplayer Intro Choreography
  React.useEffect(() => {
    const root = rootRef.current;
    const hero = heroRef.current;
    if (!root || !hero) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!playIntro || prefersReduced) {
      setPhase("settled");
      return;
    }

    let cancelled = false;
    const runChoreography = () => {
      if (cancelled) return;

      // Clear any previous dragged positions on replay
      root.querySelectorAll<HTMLElement>("[data-drag]").forEach((el) => {
        el.style.translate = "";
        delete el.dataset.off;
      });

      setPhase("intro");

      const heroRect = hero.getBoundingClientRect();
      const relPos = (el: Element | null) => {
        if (!el) return { x: heroRect.width * 0.5, y: heroRect.height * 0.5, w: 60, h: 40 };
        const r = el.getBoundingClientRect();
        return {
          x: r.left - heroRect.left + r.width * 0.5,
          y: r.top - heroRect.top + r.height * 0.5,
          left: r.left - heroRect.left,
          top: r.top - heroRect.top,
          w: r.width,
          h: r.height,
        };
      };

      const cursors = Array.from(hero.querySelectorAll<HTMLElement>(".sy-hand-cur"));
      const frm = hero.querySelector<HTMLElement>(".sy-frm");
      const frmDim = hero.querySelector<HTMLElement>(".sy-frm-dim");
      const words = Array.from(hero.querySelectorAll<HTMLElement>(".sy-w"));
      const gridPanel = hero.querySelector<HTMLElement>(".sy-gridpanel");
      const essBox = hero.querySelector<HTMLElement>(".sy-ess");
      const wire = hero.querySelector<HTMLElement>(".sy-wire");
      const globe = hero.querySelector<HTMLElement>(".sy-globe");
      const pasteTargets = [
        hero.querySelector<HTMLElement>(".sy-note"),
        hero.querySelector<HTMLElement>(".sy-handobj"),
        hero.querySelector<HTMLElement>(".sy-photo"),
        hero.querySelector<HTMLElement>('[data-slot="star"]'),
        hero.querySelector<HTMLElement>('[data-slot="links"]'),
        hero.querySelector<HTMLElement>('[data-slot="eye"]'),
        hero.querySelector<HTMLElement>('[data-slot="coral"]'),
        hero.querySelector<HTMLElement>(".sy-armobj"),
        hero.querySelector<HTMLElement>(".sy-bustobj"),
        hero.querySelector<HTMLElement>(".sy-chipsobj"),
      ].filter(Boolean) as HTMLElement[];

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          pasteTargets.forEach((t) => t.removeAttribute("data-on"));
          setPhase("settled");
        },
      });
      tlRef.current = tl;

      // Initial hidden states
      gsap.set(words, { opacity: 0, y: 6 });
      if (gridPanel) gsap.set(gridPanel, { clipPath: "inset(0% 100% 100% 0%)" });
      if (essBox) gsap.set(essBox, { clipPath: "inset(0% 100% 100% 0%)" });
      if (wire) gsap.set(wire, { scaleX: 0 });
      if (globe) gsap.set(globe, { clipPath: "circle(0% at 50% 50%)" });
      pasteTargets.forEach((el, idx) => {
        gsap.set(el, {
          opacity: 0,
          x: idx % 2 === 0 ? -24 : 24,
          y: -16,
        });
      });

      const activeCount = window.innerWidth < 720 ? Math.min(3, cursors.length) : cursors.length;
      cursors.forEach((cur, idx) => {
        gsap.set(cur, {
          opacity: idx < activeCount ? 1 : 0,
          x: idx % 2 === 0 ? -40 : heroRect.width + 40,
          y: 90 + idx * 140,
        });
      });

      // Agent 0 (Scout): sweeps words into view
      const c0 = cursors[0];
      if (c0 && words.length) {
        const firstW = relPos(words[0]);
        const midW = relPos(words[Math.floor(words.length / 2)]);
        const lastW = relPos(words[words.length - 1]);
        tl.to(c0, { x: firstW.x, y: firstW.y, duration: 0.35 }, 0.05)
          .to(
            words,
            {
              opacity: 1,
              y: 0,
              duration: 0.16,
              stagger: 0.028,
              ease: "power2.out",
            },
            0.22
          )
          .to(c0, { x: midW.x, y: midW.y, duration: 0.45 }, 0.3)
          .to(c0, { x: lastW.x, y: lastW.y, duration: 0.45 }, 0.78);
      }

      // Agent 1 (Weaver): draws marquee bounding box for grid panel & essentially box
      const c1 = cursors[1];
      if (c1 && gridPanel && frm && frmDim) {
        const gp = relPos(gridPanel);
        tl.to(c1, { x: gp.left ?? 0, y: gp.top ?? 0, duration: 0.35 }, 0.12)
          .set(frm, { left: gp.left, top: gp.top, width: 0, height: 0, opacity: 1 }, 0.46)
          .to(
            frm,
            {
              width: gp.w,
              height: gp.h,
              duration: 0.55,
              onUpdate: () => {
                const w = Math.round(Number(gsap.getProperty(frm, "width")));
                const h = Math.round(Number(gsap.getProperty(frm, "height")));
                frmDim.textContent = `${w} × ${h}`;
              },
            },
            0.46
          )
          .to(c1, { x: (gp.left ?? 0) + gp.w, y: (gp.top ?? 0) + gp.h, duration: 0.55 }, 0.46)
          .to(gridPanel, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55 }, 0.46)
          .to(frm, { opacity: 0, duration: 0.18 }, 1.04);

        if (essBox) {
          const eb = relPos(essBox);
          tl.to(c1, { x: eb.left ?? 0, y: eb.top ?? 0, duration: 0.3 }, 1.15)
            .to(essBox, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.42 }, 1.45)
            .to(c1, { x: (eb.left ?? 0) + eb.w, y: (eb.top ?? 0) + eb.h, duration: 0.42 }, 1.45);
        }
      }

      // Agents 2 & 3 (Pilot & Relay): paste cards and inline slots with ⌘V flash
      pasteTargets.forEach((target, idx) => {
        const cur = cursors[(idx % (activeCount - 1)) + 1] || cursors[0];
        if (!cur) return;
        const keyBadge = cur.querySelector<HTMLElement>(".sy-key");
        const pos = relPos(target);
        const tAt = 0.55 + idx * 0.14;

        tl.to(cur, { x: pos.x, y: pos.y, duration: 0.32 }, tAt)
          .call(() => target.setAttribute("data-on", "1"), undefined, tAt + 0.16)
          .to(target, { opacity: 1, x: 0, y: 0, duration: 0.34, ease: "power3.out" }, tAt + 0.16)
          .call(() => target.removeAttribute("data-on"), undefined, tAt + 0.52);

        if (keyBadge) {
          tl.fromTo(
            keyBadge,
            { opacity: 0, y: 4 },
            { opacity: 1, y: 0, duration: 0.12, yoyo: true, repeat: 1, repeatDelay: 0.16 },
            tAt + 0.18
          );
        }
      });

      // Wire draw & Globe disc reveal
      if (wire) {
        tl.to(wire, { scaleX: 1, duration: 0.45 }, 1.35);
      }
      if (globe) {
        tl.to(globe, { clipPath: "circle(71% at 50% 50%)", duration: 0.55 }, 1.5);
      }

      // Exit cursors to nearest viewport edges
      cursors.forEach((cur, idx) => {
        tl.to(
          cur,
          {
            x: idx % 2 === 0 ? -80 : heroRect.width + 80,
            opacity: 0,
            duration: 0.4,
          },
          2.15 + idx * 0.04
        );
      });
    };

    const fonts = typeof document !== "undefined" ? document.fonts : undefined;
    const fallbackTimer = window.setTimeout(runChoreography, 900);
    if (fonts?.ready) {
      fonts.ready.then(() => {
        window.clearTimeout(fallbackTimer);
        runChoreography();
      });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      tlRef.current?.kill();
    };
  }, [playIntro, runId]);

  const handleReplayOrSkip = () => {
    if (phase === "intro" && tlRef.current) {
      tlRef.current.progress(1);
      setPhase("settled");
      return;
    }
    setRunId((n) => n + 1);
  };

  // Grid cell hover highlight
  const handleGridMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    const cell = cellRef.current;
    if (!grid || !cell) return;
    const rect = grid.getBoundingClientRect();
    const cellSize = rect.width / 12;
    const col = Math.max(0, Math.min(11, Math.floor((e.clientX - rect.left) / cellSize)));
    const row = Math.max(0, Math.min(10, Math.floor((e.clientY - rect.top) / cellSize)));
    cell.style.width = `${cellSize.toFixed(2)}px`;
    cell.style.height = `${cellSize.toFixed(2)}px`;
    cell.style.transform = `translate(${(col * cellSize).toFixed(2)}px, ${(row * cellSize).toFixed(2)}px)`;
    cell.style.opacity = "1";
  };

  const handleGridLeave = () => {
    if (cellRef.current) cellRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={rootRef}
      data-phase={phase}
      className={className ? `sy-root ${className}` : "sy-root"}
      style={style}
    >
      <style>{SY_CSS}</style>
      <section
        ref={heroRef}
        className="sy-hero"
        aria-label="Introduction"
        style={{ minHeight: height }}
      >
        {/* Full-height vertical column guide */}
        <div className="sy-guide" aria-hidden="true" />

        {/* Header */}
        <header className="sy-nav">
          <a
            className="sy-brand"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {brand}
          </a>

          <button
            type="button"
            className="sy-replay"
            onClick={handleReplayOrSkip}
            aria-label={phase === "intro" ? "Skip the intro" : "Replay the intro"}
          >
            {phase === "intro" ? "Skip" : "Replay"}
            <span className="sy-rp-w"> intro</span>
          </button>

          <p className="sy-time">
            <span>Local time</span>
            <span>{clock || `${city} --:--`}</span>
          </p>
        </header>

        {/* Main 30fr / 70fr Two-Column Body */}
        <div className="sy-main sy-cols">
          {/* Left Interactive Moodboard */}
          <div className="sy-boardwrap" aria-hidden="true">
            <div className="sy-board" data-paper={paper}>
              {/* 1. Grid / Dot Paper Panel */}
              <div className="sy-obj sy-gridpanel">
                <div
                  ref={gridRef}
                  className="sy-grid"
                  onPointerMove={handleGridMove}
                  onPointerLeave={handleGridLeave}
                >
                  <i ref={cellRef} className="sy-cell" />
                </div>
              </div>

              {/* 2. Floating Note Card */}
              <div
                className="sy-obj sy-note sy-sel"
                data-drag=""
                style={{ ["--d" as string]: 4 }}
              >
                <span className="sy-tag">note.md</span>
                <div className="sy-par" style={{ ["--d" as string]: 4 }}>
                  <div className="sy-notecard">
                    <div className="sy-bars">
                      <span className="sy-bar">
                        <i style={{ width: "55%" }} />
                      </span>
                      <span className="sy-bar">
                        <i style={{ width: "30%" }} />
                      </span>
                      <span className="sy-bar">
                        <i style={{ width: "80%" }} />
                      </span>
                      <span className="sy-bar">
                        <i style={{ width: "45%" }} />
                      </span>
                      <b />
                    </div>
                    <p>
                      {note} / A LIVING <em>{noteTag}</em> PRACTICE.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Etched Hand + Gizmo */}
              <div className="sy-obj sy-handobj sy-sel" data-drag="">
                <span className="sy-tag">hand.webp</span>
                <div className="sy-par" style={{ ["--d" as string]: 12 }}>
                  <div className="sy-handwrap">
                    <div
                      className="sy-handmask"
                      style={{
                        WebkitMaskImage: `url(${assetBase}hand.webp)`,
                        maskImage: `url(${assetBase}hand.webp)`,
                      }}
                    />
                    <svg
                      className="sy-gizmo"
                      viewBox="0 0 562 231"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path d="M98 42 C136 86, 136 146, 98 190" />
                      <path d="M92 50 L98 40 L108 46" />
                      <path d="M92 182 L98 192 L108 186" />
                      <path d="M294 64 L310 64 M302 56 L302 72" />
                      <path d="M438 118 L454 118 M446 110 L446 126" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 4. Horizontal Connector Wire */}
              <div className="sy-obj sy-wire">
                <i />
              </div>

              {/* 5. Lab Photo Window Card */}
              <div className="sy-obj sy-photo sy-sel" data-drag="">
                <span className="sy-tag">lab.webp</span>
                <div className="sy-par" style={{ ["--d" as string]: 7 }}>
                  <div className="sy-win">
                    <div className="sy-winbar">
                      <i />
                    </div>
                    <img
                      src={`${assetBase}lab.webp`}
                      alt=""
                      width={740}
                      height={484}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>

              {/* 6. Wireframe Globe */}
              <div className="sy-obj sy-globe">
                <div className="sy-par" style={{ ["--d" as string]: 5 }}>
                  <svg
                    ref={globeRef}
                    viewBox="0 0 100 100"
                    className="sy-globe-svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <circle cx="50" cy="50" r="46" />
                    <ellipse cx="50" cy="20" rx="35" ry="7" />
                    <ellipse cx="50" cy="35" rx="43.5" ry="9" />
                    <ellipse cx="50" cy="50" rx="46" ry="10" />
                    <ellipse cx="50" cy="65" rx="43.5" ry="9" />
                    <ellipse cx="50" cy="80" rx="35" ry="7" />
                    <ellipse className="sy-mer" cx="50" cy="50" rx="46" ry="46" />
                    <ellipse className="sy-mer" cx="50" cy="50" rx="32" ry="46" />
                    <ellipse className="sy-mer" cx="50" cy="50" rx="18" ry="46" />
                    <ellipse className="sy-mer" cx="50" cy="50" rx="6" ry="46" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Editorial Copy Column */}
          <div className="sy-copy">
            <div className="sy-stmt">
              <h1 className="sy-h sy-p1">
                {renderTokens(lead, assetBase, pupilRef)}
              </h1>

              <div className="sy-p2row">
                <p className="sy-h sy-p2">
                  {renderTokens(body, assetBase, pupilRef)}
                </p>

                {/* Media Pair */}
                <div className="sy-pair" aria-hidden="true">
                  <div className="sy-armobj sy-sel" data-drag="">
                    <span className="sy-tag">prosthesis.webp</span>
                    <div className="sy-par" style={{ ["--d" as string]: 6 }}>
                      <div className="sy-armbox">
                        <div
                          className="sy-armmask"
                          style={{
                            WebkitMaskImage: `url(${assetBase}arm.webp)`,
                            maskImage: `url(${assetBase}arm.webp)`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <svg
                    className="sy-arrow"
                    viewBox="0 0 24 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M0 6 H21 M16 1 L22 6 L16 11" />
                  </svg>

                  <div className="sy-bustobj sy-sel" data-drag="">
                    <span className="sy-tag">bust.webp</span>
                    <div className="sy-par" style={{ ["--d" as string]: 10 }}>
                      <div
                        className="sy-bustmask"
                        style={{
                          WebkitMaskImage: `url(${assetBase}bust.webp)`,
                          maskImage: `url(${assetBase}bust.webp)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls & Callout Row */}
            <div className="sy-foot">
              <div className="sy-chipsobj sy-sel">
                <span className="sy-tag">pattern.toggle</span>
                <button
                  type="button"
                  className="sy-toggle"
                  aria-pressed={paper === "dots"}
                  aria-label="Swap the board between grid and dot paper"
                  onClick={() => setPaper((p) => (p === "grid" ? "dots" : "grid"))}
                >
                  <span className="sy-tg-a" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <circle cx="10" cy="10" r="8" />
                      <ellipse cx="10" cy="10" rx="3.8" ry="8" />
                      <line x1="2" y1="10" x2="18" y2="10" />
                    </svg>
                  </span>
                  <span className="sy-tg-b" aria-hidden="true">
                    <span />
                  </span>
                </button>
              </div>

              <aside className="sy-ess">
                <span className="sy-ess-x" aria-hidden="true" />
                <div className="sy-ess-h">
                  <span>ESSENTIALLY</span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="3.2" r="2.2" />
                    <circle cx="12.8" cy="8" r="2.2" />
                    <circle cx="8" cy="12.8" r="2.2" />
                    <circle cx="3.2" cy="8" r="2.2" />
                  </svg>
                </div>
                <p className="sy-ess-p">{essentially}</p>
              </aside>
            </div>
          </div>
        </div>

        {/* Multiplayer Intro Cursors & Marquee Box */}
        <div className="sy-hands" aria-hidden="true">
          <div className="sy-frm">
            <span className="sy-frm-dim">0 × 0</span>
          </div>
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="sy-hand-cur"
              style={{ ["--c" as string]: agent.color }}
            >
              <svg
                className="sy-cur-icon"
                viewBox="0 0 20 20"
                fill={agent.color}
                stroke="#ffffff"
                strokeWidth="1.5"
              >
                <path d="M3 2 L16 10 L10 11.5 L7.5 17.5 Z" />
              </svg>
              <span className="sy-key">⌘V</span>
              <span className="sy-name">{agent.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
