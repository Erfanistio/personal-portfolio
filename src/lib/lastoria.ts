/* Lastoria is self-hosted and registered once, so the particle wordmark can
   draw the real outlines. The promise is shared: the preloader downloads it
   before the curtain lifts, and the hero component draws with the same face
   without a second request. */

export const LASTORIA_PATH = "/fonts/LastoriaBoldRegular.otf";

const FAMILY = "Lastoria Particle";

let pending: Promise<string> | null = null;

export function ensureLastoria(): Promise<string> {
  if (pending) return pending;

  pending = (async () => {
    const response = await fetch(LASTORIA_PATH);
    if (!response.ok) throw new Error(`Lastoria is missing at ${LASTORIA_PATH}`);

    const buffer = await response.arrayBuffer();
    const face = new FontFace(FAMILY, buffer);
    await face.load();
    document.fonts.add(face);
    return FAMILY;
  })();

  return pending;
}
