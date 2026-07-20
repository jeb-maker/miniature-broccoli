import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/select';

const meta: Meta = {
  title: 'Components/Select',
  component: 'ds-select',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ds-select
      label="Country"
      .options=${[
        { value: 'fr', label: 'France' },
        { value: 'ca', label: 'Canada' },
        { value: 'be', label: 'Belgium' },
      ]}
    ></ds-select>
  `,
};
