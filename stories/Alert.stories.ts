import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/alert';

const meta: Meta = {
  title: 'Components/Alert',
  component: 'mb-alert',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Info: Story = {
  render: () => html`<mb-alert variant="info">Heads up — schedule updated.</mb-alert>`,
};

export const Danger: Story = {
  render: () => html`<mb-alert variant="danger">Payment failed. Try again.</mb-alert>`,
};
