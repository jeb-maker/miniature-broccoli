import type { StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    const base = process.env.STORYBOOK_BASE_PATH || '/';
    return mergeConfig(config, {
      base,
      // Component modules call customElements.define — must not be tree-shaken.
      build: {
        rollupOptions: {
          treeshake: {
            moduleSideEffects: (id: string) =>
              /\/src\/components\//.test(id) || /\/src\/tokens\//.test(id) || null,
          },
        },
      },
    });
  },
};

export default config;
