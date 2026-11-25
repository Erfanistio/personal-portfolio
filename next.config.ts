import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The local preview can be opened on either loopback name; dev resources
  // are otherwise blocked as cross-origin.
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      /* Only the global sheet goes through Tailwind. Matching every "*.css"
         also caught *.module.css, which strips the class map and leaves
         every component unstyled, so the path is narrowed here. */
      "*": {
        condition: { path: /^src\/app\/globals\.css$/ },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
