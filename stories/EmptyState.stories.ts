import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbEmptyState } from '../src/components/empty-state.js';
import { MbButton } from '../src/components/button.js';

void MbEmptyState;
void MbButton;

const meta: Meta = {
  title: 'Components/EmptyState',
  component: 'mb-empty-state',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-empty-state heading="No runs yet">
      Create a run to start collecting evidence.
      <mb-button slot="actions" href="#new">New run</mb-button>
      <mb-button slot="actions" variant="secondary" href="#templates">Browse templates</mb-button>
    </mb-empty-state>
  `,
};
