import type { Preview } from '@storybook/web-components';
import { html } from 'lit';
import '../src/tokens/tokens.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    // Padded (not centered) so block fields / tables / toolbars can show full-width defaults.
    layout: 'padded',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  decorators: [
    (story) => html`
      <div
        style="inline-size: 100%; max-inline-size: 100%; min-inline-size: 0; box-sizing: border-box;"
      >
        ${story()}
      </div>
    `,
  ],
};

export default preview;
