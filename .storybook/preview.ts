import type { Preview } from '@storybook/web-components';
import { html } from 'lit';
import '../src/tokens/tokens.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  decorators: [
    (story) => html`
      <div
        style="max-inline-size: 100%; min-inline-size: 0; padding-inline: 0.5rem; box-sizing: border-box;"
      >
        ${story()}
      </div>
    `,
  ],
};

export default preview;
