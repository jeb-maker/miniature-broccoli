import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/modal';
import '../src/components/button';

const meta: Meta = {
  title: 'Components/Modal',
  component: 'ds-modal',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Open: Story = {
  render: () => html`
    <ds-modal heading="Confirm" open>
      <p class="ds-body">Native dialog with Escape and backdrop dismiss.</p>
      <div slot="footer">
        <ds-button variant="secondary">Cancel</ds-button>
      </div>
    </ds-modal>
  `,
};
