import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbBadge } from '../src/components/badge.js';
import { MbCard } from '../src/components/card.js';

void MbBadge;
void MbCard;

const meta: Meta = {
  title: 'Recipes/Timeline',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Prefer a host list + `mb-badge` over a dedicated timeline CE. Markers use status tokens.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const StatusEvents: Story = {
  render: () => html`
    <style>
      .mb-recipe-timeline {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--mb-space-4);
        border-inline-start: 2px solid var(--mb-color-border);
        padding-inline-start: var(--mb-space-4);
      }
      .mb-recipe-timeline li {
        position: relative;
      }
      .mb-recipe-timeline li::before {
        content: '';
        position: absolute;
        inset-inline-start: calc(-1 * var(--mb-space-4) - 5px);
        inset-block-start: 0.35rem;
        inline-size: 0.65rem;
        block-size: 0.65rem;
        border-radius: 50%;
        background: var(--mb-color-border);
      }
      .mb-recipe-timeline li[data-status='ok']::before {
        background: var(--mb-color-success);
      }
      .mb-recipe-timeline li[data-status='nok']::before {
        background: var(--mb-color-danger);
      }
      .mb-recipe-timeline li[data-status='na']::before {
        background: var(--mb-color-muted);
      }
      .mb-recipe-timeline .meta {
        color: var(--mb-color-muted);
        font-size: var(--mb-font-size-sm);
        margin-block-start: 0.15rem;
      }
    </style>
    <mb-card>
      <span slot="header">Event history</span>
      <ol class="mb-recipe-timeline">
        <li data-status="ok">
          <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
            <strong>Marked OK</strong>
            <mb-badge variant="success">ok</mb-badge>
          </div>
          <p class="meta">Ada · yesterday</p>
          <p class="mb-body-sm">Evidence attached.</p>
        </li>
        <li data-status="nok">
          <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
            <strong>Marked NOK</strong>
            <mb-badge variant="danger">nok</mb-badge>
          </div>
          <p class="meta">Baz · 2 days ago</p>
        </li>
        <li data-status="na">
          <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
            <strong>Not applicable</strong>
            <mb-badge>na</mb-badge>
          </div>
          <p class="meta">System · last week</p>
        </li>
      </ol>
    </mb-card>
  `,
};
