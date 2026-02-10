import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Frontend will call /api/... and Vite proxies to serverless-offline
      "/api": {
        target: "http://localhost:3000/dev",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
