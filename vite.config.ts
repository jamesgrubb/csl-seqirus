import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, Vite serves the UI and proxies API/media calls to `wrangler pages dev` (Functions + local D1/R2).
export default defineConfig({
  plugins: [react()],
  // GOOGLE_MAPS_API_KEY (from .env.local) is a browser key, so it's safe to ship in the bundle.
  envPrefix: ["VITE_", "GOOGLE_MAPS_API_KEY"],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8788",
      "/media": "http://localhost:8788",
    },
  },
});
