import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbBadge } from '../src/components/badge.js';

void MbBadge;

const meta: Meta = {
  title: 'Components/Badge',
  component: 'mb-badge',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
      <mb-badge>Neutral</mb-badge>
      <mb-badge variant="info">Info</mb-badge>
      <mb-badge variant="success">Success</mb-badge>
      <mb-badge variant="warning">Warning</mb-badge>
      <mb-badge variant="danger">Danger</mb-badge>
    </div>
  `,
};
