// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: {
      key: './cert/private.key',
      cert: './cert/public.crt',
    },
    proxy: {

      '/user': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // dasselbe für deine Auth-Routes
      '/auth': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // @ts-expect-error  Vitest-Typen kennen typecheck noch nicht
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setupTests.ts'],
  },
});
