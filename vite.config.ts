import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

    return {
    base: env.VITE_PUBLIC_URL,
    plugins: [react(), tailwindcss()],
    build: {
      outDir: "docs",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Force dev to use the local package build (not the pnpm store copy)
        "tiptap-pagination-plus": path.resolve(__dirname, "./packages/tiptap-pagination-plus/dist"),
      },
    },
    server: {
      fs: {
        // Allow serving files from the packages directory
        allow: ['..']
      },
      watch: {
        // Don't use polling, but ensure proper watching
        usePolling: false,
      },
    },
    optimizeDeps: {
      // Exclude local packages from pre-bundling to prevent caching issues
      exclude: ['tiptap-pagination-plus'],
      // Let Vite auto-detect dependencies instead of forcing includes
      include: [
        'react',
        'react-dom'
      ],
    },
    define: {
      // Ensure proper module resolution
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }
})
