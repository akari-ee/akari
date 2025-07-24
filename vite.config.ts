import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      "/upload": {
        target: "https://filmin-worker.zentechie7.workers.dev",
        changeOrigin: true,
        secure: true, // https일 때는 secure: true 권장
      },
    },
  },
  ssr: {
    noExternal: [
      'lucide-react',
      '@phosphor-icons/react'
    ]
  }
});
