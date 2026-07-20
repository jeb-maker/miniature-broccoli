import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbToast } from '../src/components/toast.js';
import { MbButton } from '../src/components/button.js';
import type { MbToast as ToastEl } from '../src/components/toast.js';

void MbToast;
void MbButton;

const meta: Meta = {
  title: 'Components/Toast',
  component: 'mb-toast',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Success: Story = {
  render: () => html`
    <mb-button
      @click=${() => {
        const toast = document.querySelector('mb-toast') as ToastEl | null;
        toast?.show('Run updated', 'success');
      }}
    >
      Show toast
    </mb-button>
    <mb-toast></mb-toast>
  `,
};
