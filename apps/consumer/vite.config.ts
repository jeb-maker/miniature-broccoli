import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname),
  resolve: {
    alias: {
      '@miniature-broccoli/mb/tokens.css': resolve(__dirname, '../../dist/tokens/tokens.css'),
      '@miniature-broccoli/mb/button': resolve(__dirname, '../../dist/components/button.js'),
      '@miniature-broccoli/mb/input': resolve(__dirname, '../../dist/components/input.js'),
    },
  },
  server: {
    port: 5173,
    fs: { allow: [resolve(__dirname, '../..')] },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
