import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";

export default defineConfig({
  environments: {
    ssr: {},
    worker: {
      optimizeDeps: {
        exclude: ["md4x"],
      },
      resolve: {
        conditions: ["unwasm"],
      },
    },
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "worker" },
    }),
    redwood(),
    tailwindcss(),
  ],
});
