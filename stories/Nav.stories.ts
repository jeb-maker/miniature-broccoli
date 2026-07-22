import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbNav } from '../src/components/nav.js';
import { MbNavToggle } from '../src/components/nav-toggle.js';

void MbNav;
void MbNavToggle;

const meta: Meta = {
  title: 'Components/Nav',
  component: 'mb-nav',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const DesktopLinks: Story = {
  render: () => html`
    <mb-nav label="Site" data-always-visible>
      <a href="#revues" aria-current="page">Revues</a>
      <a href="#tasks">Tasks</a>
      <a href="#admin">Admin</a>
    </mb-nav>
  `,
};

export const WithMobileToggle: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:0.75rem;justify-content:space-between;">
      <strong class="mb-body">Acme</strong>
      <mb-nav-toggle for="demo-nav"></mb-nav-toggle>
    </div>
    <mb-nav id="demo-nav" label="Site">
      <a href="#revues" aria-current="page">Revues</a>
      <a href="#tasks">Tasks</a>
      <a href="#admin">Admin</a>
    </mb-nav>
    <p class="mb-body-sm" style="margin-block-start:1rem;">
      Resize below 36rem to exercise the toggle. On wide viewports the nav stays visible.
    </p>
  `,
};
