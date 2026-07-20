import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/badge';

const meta: Meta = {
  title: 'Components/Badge',
  component: 'ds-badge',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
      <ds-badge>Neutral</ds-badge>
      <ds-badge variant="info">Info</ds-badge>
      <ds-badge variant="success">Success</ds-badge>
      <ds-badge variant="warning">Warning</ds-badge>
      <ds-badge variant="danger">Danger</ds-badge>
    </div>
  `,
};
