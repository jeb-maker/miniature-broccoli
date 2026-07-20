import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbModal } from '../src/components/modal.js';
import { MbButton } from '../src/components/button.js';

void MbModal;
void MbButton;

const meta: Meta = {
  title: 'Components/Modal',
  component: 'mb-modal',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Open: Story = {
  render: () => html`
    <mb-modal heading="Confirm" open>
      <p class="mb-body">Native dialog with Escape and backdrop dismiss.</p>
      <div slot="footer">
        <mb-button variant="secondary">Cancel</mb-button>
      </div>
    </mb-modal>
  `,
};
