import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5179, strictPort: true },
  cacheDir: 'node_modules/.vite-bbb',
  optimizeDeps: { force: true },
  define: { __DEFINES__: '{}' }, // safety net

  // 👇 Any attempt to import this internal file is redirected to a no-op.
  resolve: {
    alias: {
      'vite/dist/client/env.mjs': '/src/vite-env-shim.js',
    },
  },
});
