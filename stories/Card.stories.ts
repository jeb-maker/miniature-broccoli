import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/card';
import '../src/components/button';

const meta: Meta = {
  title: 'Components/Card',
  component: 'mb-card',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-card style="inline-size: min(24rem, 100%); max-inline-size: 100%;">
      <div slot="header">Workspace</div>
      <p class="mb-body">Compose sections with header, body, and footer slots.</p>
      <div slot="footer">
        <mb-button size="sm">Open</mb-button>
      </div>
    </mb-card>
  `,
};
