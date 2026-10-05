import { cp, readFile, rename, writeFile, rm } from "node:fs/promises";
import { generateSW } from "workbox-build";

// Vite builds the application; Netlify serves the existing landing page at /.
// Build first so repeated runs cannot rename the landing page as the app.
const app = await readFile("dist/index.html", "utf8");
if (!app.includes('id="root"'))
  throw new Error("Build the application before packaging.");
await writeFile(
  "dist/index.html",
  app.replace("<head>", '<head><base href="/">'),
);
await rename("dist/index.html", "dist/sistema.html");
await cp("site", "dist", { recursive: true });
await rm("dist/stats.html", { force: true });
await generateSW({
  globDirectory: "dist",
  globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
  globIgnores: [
    "sw.js",
    "workbox-*.js",
    "auth-callback.html",
    "auth-redirect.js",
  ],
  swDest: "dist/sw.js",
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  navigateFallback: "/sistema.html",
  navigateFallbackDenylist: [
    /^\/$/,
    /^\/index\.html$/,
    /^\/termos/,
    /^\/privacidade/,
    /auth-callback/,
  ],
  cleanupOutdatedCaches: true,
  skipWaiting: true,
  clientsClaim: true,
});
process.stdout.write(
  "CRM Pro packaged: landing page, application, email callbacks and offline assets.\n",
);
