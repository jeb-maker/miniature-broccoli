import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbSpinner } from '../src/components/spinner.js';

void MbSpinner;

const meta: Meta = {
  title: 'Components/Spinner',
  component: 'mb-spinner',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display:flex;gap:1rem;align-items:center;">
      <mb-spinner size="sm" label="Loading row"></mb-spinner>
      <mb-spinner label="Loading"></mb-spinner>
      <span class="mb-body-sm">Compatible with HTMX <code>hx-indicator</code> via <code>hidden</code>.</span>
    </div>
  `,
};
