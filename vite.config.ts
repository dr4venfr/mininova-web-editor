/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from https://nclavaud.github.io/mininova-web-editor/
  base: '/mininova-web-editor/',
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
  },
});
