import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    // The API has no path prefix, so the dev server forwards the known
    // top-level API routes to the Express app (default http://localhost:3000).
    proxy: {
      '^/(sessions|tokens|users|emails|password-reset-requests|passwords|me|projects|admin)(/.*)?$': {
        target: process.env.BUGTRACKER_API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
