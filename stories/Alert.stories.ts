import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/alert';

const meta: Meta = {
  title: 'Components/Alert',
  component: 'ds-alert',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Info: Story = {
  render: () => html`<ds-alert variant="info">Heads up — schedule updated.</ds-alert>`,
};

export const Danger: Story = {
  render: () => html`<ds-alert variant="danger">Payment failed. Try again.</ds-alert>`,
};
