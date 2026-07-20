import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/button';

const meta: Meta = {
  title: 'Components/Button',
  component: 'mb-button',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
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
