import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbCard } from '../src/components/card.js';
import { MbButton } from '../src/components/button.js';

void MbCard;
void MbButton;

const meta: Meta = {
  title: 'Components/Card',
  component: 'mb-card',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-card>
      <span slot="header">Section</span>
      <p class="mb-body">Layout cards stay visible before CE upgrade (no anti-FOUC hide).</p>
      <mb-button slot="footer" href="#more">Details</mb-button>
    </mb-card>
  `,
};

export const ProgressiveRender: Story = {
  name: 'Progressive / MPA note',
  render: () => html`
    <div style="max-inline-size:36rem;">
      <p class="mb-body">
        Interactive controls keep anti-FOUC <code>visibility: hidden</code> until defined.
        Structural <code>mb-card</code> (and other layout primitives) do <strong>not</strong>, so
        Go MPA hosts can render section chrome without waiting for Lit. Opt in with class
        <code>mb-fouc</code> if you need the old hide behavior on a layout tag.
      </p>
      <mb-card>
        <span slot="header">Readable structure</span>
        Body content remains in light DOM; chrome upgrades when the module loads.
      </mb-card>
    </div>
  `,
};
