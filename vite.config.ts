import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// LEXDEN FORGE - Day 1 scaffold.
// Dependency-light Vite + React + TS PWA. Service worker is hand-written
// (see public/sw.js) rather than pulling in a PWA plugin, to keep the
// dependency surface minimal per project non-negotiables.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
} as any);
