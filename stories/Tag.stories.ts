import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbTag } from '../src/components/tag.js';
import { MbBadge } from '../src/components/badge.js';

void MbTag;
void MbBadge;

const meta: Meta = {
  title: 'Components/Tag',
  component: 'mb-tag',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
      <mb-tag>domain</mb-tag>
      <mb-tag size="sm">source:github</mb-tag>
      <mb-tag href="#filter">filterable</mb-tag>
      <mb-badge variant="success">status</mb-badge>
    </div>
  `,
};
