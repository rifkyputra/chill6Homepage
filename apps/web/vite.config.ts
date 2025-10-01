import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tailwindcss(),
      tanstackRouter({}),
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "chill6homepage",
          short_name: "chill6homepage",
          description: "chill6homepage - PWA Application",
          theme_color: "#0c0c0c",
        },
        pwaAssets: { disabled: false, config: true },
        devOptions: { enabled: true },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
