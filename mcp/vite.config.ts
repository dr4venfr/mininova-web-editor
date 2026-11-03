// Bundles the MCP server for Node.js: `yarn mcp:build` writes mcp/dist/server.js
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  // Same base as the web editor, used by the shared help module
  base: '/mininova-web-editor/',
  // Static assets belong to the web editor
  publicDir: false,
  build: {
    ssr: 'mcp/server.ts',
    outDir: 'mcp/dist',
    emptyOutDir: true,
    target: 'node22',
  },
});
