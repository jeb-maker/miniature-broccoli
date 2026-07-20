import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/input';

const meta: Meta = {
  title: 'Components/Input',
  component: 'ds-input',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () =>
    html`<ds-input label="Email" type="email" hint="We never share your email."></ds-input>`,
};

export const Invalid: Story = {
  render: () => html`<ds-input label="Name" error="Name is required." invalid></ds-input>`,
};
