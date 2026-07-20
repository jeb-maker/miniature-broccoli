import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname),
  resolve: {
    alias: {
      '@jeb-maker/mb/tokens.css': resolve(__dirname, '../../dist/tokens/tokens.css'),
      '@jeb-maker/mb/button': resolve(__dirname, '../../dist/components/button.js'),
      '@jeb-maker/mb/input': resolve(__dirname, '../../dist/components/input.js'),
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
