export const site = {
  name: "Erfan Akrami",
  firstName: "Erfan",
  role: "Creative developer",
  tagline: "Interfaces with a pulse.",
  description:
    "Creative developer working where design meets engineering. Interaction, motion and WebGL for products people remember.",
  email: "hello@erfanakrami.dev",
  github: "https://github.com/erfanistio",
  location: "Remote, working worldwide",
  availability: "Available for select projects",
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "Portfolio, 2026",
    headline: ["I build interfaces", "you can feel."],
    intro:
      "Creative development at the seam of design and engineering. I make fast, accessible websites with motion that means something.",
    primaryCta: { label: "See selected work", href: "#work" },
    secondaryCta: { label: "Start a conversation", href: "#contact" },
    stats: [
      { value: "8+", label: "Years building for the web" },
      { value: "40+", label: "Shipped products and sites" },
      { value: "3", label: "Disciplines: design, code, motion" },
    ],
  },
  about: {
    eyebrow: "About",
    headline: "Designer's eye, engineer's hands.",
    paragraphs: [
      "I am Erfan, a creative developer focused on the parts of the web people actually feel: the first second of a page, the weight of a scroll, the way a button answers back.",
      "My work sits between product engineering and art direction. I prototype in the browser, keep the bundle honest, and treat accessibility as part of the craft rather than a final checkbox.",
      "When I am not shipping client work, I build small tools and experiments: shader studies, type systems, interface toys. A few of them are still running on this page.",
    ],
    capabilities: [
      {
        title: "Interface engineering",
        detail:
          "Design systems, component architecture and production front ends in React, Next.js and TypeScript.",
      },
      {
        title: "Motion and interaction",
        detail:
          "Scroll choreography, page transitions and micro-interactions with GSAP, Lenis and Motion.",
      },
      {
        title: "Real-time visuals",
        detail:
          "WebGL scenes, shaders and canvas systems with Three.js and raw GLSL, built to stay fast.",
      },
      {
        title: "Design direction",
        detail:
          "Type, color and layout systems that give a product a voice instead of a template.",
      },
    ],
    principles: [
      "Performance is a design decision.",
      "Motion should explain, not decorate.",
      "Every state deserves a real design.",
      "If it cannot be used by keyboard, it is not finished.",
    ],
  },
  contact: {
    eyebrow: "Contact",
    headline: "Have something in mind?",
    intro:
      "Tell me what you are building, who it is for and when it needs to exist. I reply to every serious inquiry within two working days.",
    note: "Prefer email? Write to",
  },
  footer: {
    note: "Designed and built by hand. Next.js, GSAP, Three.js and a lot of coffee.",
  },
} as const;

export type SiteContent = typeof site;
