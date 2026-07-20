import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbPagination } from '../src/components/pagination.js';

void MbPagination;

const meta: Meta = {
  title: 'Components/Pagination',
  component: 'mb-pagination',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-pagination
      status="Page 2 sur 5 (120)"
      prev-url="#1"
      next-url="#3"
    ></mb-pagination>
  `,
};

export const DisabledEdges: Story = {
  render: () => html`
    <mb-pagination status="Page 1 sur 1 (3)" prev-disabled next-disabled></mb-pagination>
  `,
};
