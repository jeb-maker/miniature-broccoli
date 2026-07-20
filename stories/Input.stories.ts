import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbInput } from '../src/components/input.js';

void MbInput;

const meta: Meta = {
  title: 'Components/Input',
  component: 'mb-input',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () =>
    html`<mb-input label="Email" type="email" hint="We never share your email."></mb-input>`,
};

export const Invalid: Story = {
  render: () => html`<mb-input label="Name" error="Name is required." invalid></mb-input>`,
};

export const Number: Story = {
  render: () =>
    html`<mb-input label="SMTP port" type="number" min="1" max="65535" step="1" value="587"></mb-input>`,
};

export const File: Story = {
  render: () =>
    html`<mb-input
      label="Evidence"
      type="file"
      accept="image/jpeg,image/png,image/webp,application/pdf"
      hint="JPEG/PNG/WebP/PDF ≤ 5MB"
    ></mb-input>`,
};

export const Compact: Story = {
  render: () =>
    html`<mb-input
      density="compact"
      hide-label
      aria-label="Comment"
      placeholder="Add a comment"
    ></mb-input>`,
};
