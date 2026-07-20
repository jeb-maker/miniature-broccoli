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
