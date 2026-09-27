import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbTag } from '../src/components/tag.js';

void MbTag;

const meta: Meta = {
  title: 'Components/Tag',
  component: 'mb-tag',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '**Deprecated.** `mb-tag` is a compatibility alias of `mb-badge` (defaults to `size="md"`). Migrate to `mb-badge`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

/** @deprecated Prefer Components/Badge */
export const AliasOfBadge: Story = {
  name: 'Alias of Badge (deprecated)',
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;max-inline-size:28rem;">
      <p class="mb-body-sm" style="margin:0;color:var(--mb-color-muted);">
        Same chip as <code>mb-badge</code>. Prefer the badge API below.
      </p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
        <mb-tag>domain</mb-tag>
        <mb-tag size="sm">source:github</mb-tag>
        <mb-tag href="#filter">filterable</mb-tag>
      </div>
      <pre
        class="mb-body-sm"
        style="margin:0;padding:var(--mb-space-3);background:var(--mb-color-bg);border-radius:var(--mb-radius-md);overflow:auto;"
      ><code>&lt;mb-badge size="md" href="#filter"&gt;filterable&lt;/mb-badge&gt;</code></pre>
    </div>
  `,
};
