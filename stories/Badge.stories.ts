import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbBadge } from '../src/components/badge.js';

void MbBadge;

const meta: Meta = {
  title: 'Components/Badge',
  component: 'mb-badge',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Single chip primitive for status labels (`variant`) and filterable labels (`href`). Prefer this over `mb-tag` (deprecated alias).',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
      <mb-badge>Neutral</mb-badge>
      <mb-badge variant="info">Info</mb-badge>
      <mb-badge variant="success">Success</mb-badge>
      <mb-badge variant="warning">Warning</mb-badge>
      <mb-badge variant="danger">Danger</mb-badge>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
      <mb-badge size="sm">status sm</mb-badge>
      <mb-badge size="md">filter md</mb-badge>
      <mb-badge size="md" href="#domain">filterable</mb-badge>
    </div>
  `,
};

export const FilterLinks: Story = {
  name: 'Filter links',
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
      <mb-badge size="md" href="#domain">domain</mb-badge>
      <mb-badge size="md" href="#source" variant="info">source:github</mb-badge>
      <mb-badge size="sm" variant="success">ok</mb-badge>
    </div>
  `,
};
