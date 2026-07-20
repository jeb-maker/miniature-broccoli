import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/textarea';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'mb-textarea',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<mb-textarea label="Message" rows="5" hint="Max 500 characters."></mb-textarea>`,
};
