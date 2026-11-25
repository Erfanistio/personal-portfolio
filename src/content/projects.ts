export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  summary: string;
  description: string | null;
  tags: string[];
  stack: string[];
  href: string | null;
  repo: string | null;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  message: string;
  status: "new" | "read" | "archived";
  source: string;
  created_at: string;
};

export type ProjectInput = Omit<
  Project,
  "id" | "created_at" | "updated_at"
>;

/**
 * Seed projects. These are placeholders so the site never renders an empty
 * gallery. Replace them from /admin once Supabase is connected.
 */
export const seedProjects: Project[] = [
  {
    id: "seed-wayglim",
    slug: "wayglim",
    title: "Wayglim",
    subtitle: "A light field you can steer",
    year: "2026",
    role: "Concept, shader design, build",
    summary:
      "A real-time WebGL background that bends a band of light around the pointer without ever leaving the compositor.",
    description:
      "Wayglim is a self-initiated study in restraint: one band of chromatic light, one grain pass, one interaction. The shader runs a single full-screen pass, pauses offscreen and falls back to a still frame when the visitor prefers reduced motion.",
    tags: ["WebGL", "Shader", "Generative"],
    stack: ["GLSL", "React", "TypeScript"],
    href: null,
    repo: null,
    image_url: null,
    featured: true,
    published: true,
    sort_order: 1,
  },
  {
    id: "seed-aperture",
    slug: "aperture",
    title: "Aperture",
    subtitle: "Editorial system for a photo archive",
    year: "2025",
    role: "Design direction, front end",
    summary:
      "A quiet archive for 12,000 photographs, built around a search that behaves like a contact sheet instead of a database.",
    description:
      "The archive needed to feel like browsing a drawer of prints. We replaced faceted filters with a live contact sheet, keyboard-first navigation and a reading view that keeps the image at its native ratio.",
    tags: ["Editorial", "Search", "Archive"],
    stack: ["Next.js", "TypeScript", "Postgres"],
    href: null,
    repo: null,
    image_url: null,
    featured: true,
    published: true,
    sort_order: 2,
  },
  {
    id: "seed-nocturne",
    slug: "nocturne",
    title: "Nocturne",
    subtitle: "A listening room for a record label",
    year: "2025",
    role: "Interaction design, WebGL",
    summary:
      "An audio-first site where each release gets its own room, its own light and its own way of moving.",
    description:
      "Nocturne turns a label catalogue into a sequence of rooms. Audio state drives the visual system, so the page responds to the record instead of sitting behind it. Built with a hard budget: under 200KB of JavaScript on first load.",
    tags: ["Audio", "WebGL", "Art direction"],
    stack: ["Three.js", "GSAP", "React"],
    href: null,
    repo: null,
    image_url: null,
    featured: true,
    published: true,
    sort_order: 3,
  },
  {
    id: "seed-field-notes",
    slug: "field-notes",
    title: "Field Notes",
    subtitle: "Writing tool for a research studio",
    year: "2024",
    role: "Product design, front end",
    summary:
      "A note-taking surface that keeps structure out of the way until you ask for it.",
    description:
      "Field Notes is a block editor for a small research team. The hard part was not the editor, it was the calm: no toolbars fighting for attention, no modal detours, and a command menu that answers in under 40ms.",
    tags: ["Product", "Editor", "Design system"],
    stack: ["React", "TypeScript", "Supabase"],
    href: null,
    repo: null,
    image_url: null,
    featured: false,
    published: true,
    sort_order: 4,
  },
  {
    id: "seed-kinship",
    slug: "kinship",
    title: "Kinship",
    subtitle: "Identity and site for a small studio",
    year: "2024",
    role: "Identity, design, build",
    summary:
      "A full identity in a week: wordmark, type system, motion rules and a one-page site that loads in under a second.",
    description:
      "Kinship needed to look established without looking corporate. We built the identity around a single ligature, then let the site carry it through type, rules and one deliberate transition between sections.",
    tags: ["Identity", "Typography", "Site"],
    stack: ["Figma", "Next.js", "CSS"],
    href: null,
    repo: null,
    image_url: null,
    featured: false,
    published: true,
    sort_order: 5,
  },
  {
    id: "seed-signal-room",
    slug: "signal-room",
    title: "Signal Room",
    subtitle: "Live dashboard for infrastructure teams",
    year: "2023",
    role: "Design system, data viz",
    summary:
      "A monitoring interface that makes a wall of metrics readable at 3am, on a laptop, under pressure.",
    description:
      "Signal Room is a dense operational dashboard. We rebuilt it around hierarchy and color discipline: one accent for attention, one for danger, and everything else neutral. Charts were rewritten in canvas to keep sixty live series smooth.",
    tags: ["Dashboard", "Data viz", "Systems"],
    stack: ["React", "Canvas", "TypeScript"],
    href: null,
    repo: null,
    image_url: null,
    featured: false,
    published: true,
    sort_order: 6,
  },
];
