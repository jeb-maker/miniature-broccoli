import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbSelect } from '../src/components/select.js';

void MbSelect;

const meta: Meta = {
  title: 'Components/Select',
  component: 'mb-select',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-select
      label="Country"
      .options=${[
        { value: 'fr', label: 'France' },
        { value: 'ca', label: 'Canada' },
        { value: 'be', label: 'Belgium' },
      ]}
    ></mb-select>
  `,
};
