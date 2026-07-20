import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const componentEntries = Object.fromEntries(
  readdirSync(resolve(__dirname, 'src/components'))
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
    .map((file) => {
      const name = file.replace(/\.ts$/, '');
      return [`components/${name}`, resolve(__dirname, `src/components/${file}`)];
    }),
);

export default defineConfig({
  build: {
    lib: {
      entry: componentEntries,
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^lit(?:\/|$)/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    target: 'es2022',
  },
});
