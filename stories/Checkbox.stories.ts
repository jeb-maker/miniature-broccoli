import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/checkbox';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'ds-checkbox',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<ds-checkbox label="Subscribe to updates"></ds-checkbox>`,
};

export const Indeterminate: Story = {
  render: () => html`<ds-checkbox label="Partial" indeterminate></ds-checkbox>`,
};
