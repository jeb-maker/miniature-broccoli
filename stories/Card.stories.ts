import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/card';
import '../src/components/button';

const meta: Meta = {
  title: 'Components/Card',
  component: 'ds-card',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ds-card style="inline-size: min(24rem, 90vw);">
      <div slot="header">Workspace</div>
      <p class="ds-body">Compose sections with header, body, and footer slots.</p>
      <div slot="footer">
        <ds-button size="sm">Open</ds-button>
      </div>
    </ds-card>
  `,
};
