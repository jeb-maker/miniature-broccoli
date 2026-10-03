import { defineConfig } from 'vitest/config';

export default defineConfig({
  optimizeDeps: {
    include: ['lit', 'lit/decorators.js', 'lit/directives/repeat.js', 'axe-core'],
  },
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium', headless: true }],
    },
    include: ['src/**/*.test.ts'],
  },
});
