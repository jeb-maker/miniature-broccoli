import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbButton } from '../src/components/button.js';

void MbButton;

const meta: Meta = {
  title: 'Components/Button',
  component: 'mb-button',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj;

export const Primary: Story = {
  args: { variant: 'primary', size: 'md', disabled: false, loading: false },
  render: (args) => html`
    <mb-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      Continue
    </mb-button>
  `,
};

export const Ghost: Story = {
  render: () => html`<mb-button variant="ghost">Cancel</mb-button>`,
};

export const Danger: Story = {
  render: () => html`<mb-button variant="danger">Archive</mb-button>`,
};

export const AsLink: Story = {
  render: () => html`
    <mb-button href="#new" variant="secondary">New item</mb-button>
    <mb-button href="#destroy" variant="danger">Delete</mb-button>
  `,
};

export const IconOnly: Story = {
  render: () => html`
    <mb-button icon-only aria-label="Close" variant="ghost">×</mb-button>
  `,
};
