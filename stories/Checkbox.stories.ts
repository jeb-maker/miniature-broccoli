import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/checkbox';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'mb-checkbox',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<mb-checkbox label="Subscribe to updates"></mb-checkbox>`,
};

export const Indeterminate: Story = {
  render: () => html`<mb-checkbox label="Partial" indeterminate></mb-checkbox>`,
};
