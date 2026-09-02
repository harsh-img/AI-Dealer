import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
 
// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      include: ["@aws-sdk/client-s3"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});