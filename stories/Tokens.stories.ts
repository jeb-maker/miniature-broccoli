import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/Tokens',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

const swatches = html`
  <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(8rem,1fr));">
    ${[
      ['bg', 'var(--mb-color-bg)'],
      ['surface', 'var(--mb-color-surface)'],
      ['fg', 'var(--mb-color-fg)'],
      ['muted', 'var(--mb-color-muted)'],
      ['border', 'var(--mb-color-border)'],
      ['accent', 'var(--mb-color-accent)'],
      ['danger', 'var(--mb-color-danger)'],
      ['success', 'var(--mb-color-success)'],
    ].map(
      ([name, color]) => html`
        <div>
          <div
            style="block-size:3rem;border-radius:0.5rem;border:1px solid var(--mb-color-border);background:${color};"
          ></div>
          <p class="mb-body-sm" style="margin-block-start:0.35rem;">${name}</p>
        </div>
      `,
    )}
  </div>
`;

export const Light: Story = {
  name: 'Light scheme',
  render: () => html`
    <div class="mb-theme" data-mb-color-scheme="light" style="padding:1.5rem;background:var(--mb-color-bg);color:var(--mb-color-fg);">
      <p class="mb-title">Light tokens</p>
      <p class="mb-body">Forced with <code>data-mb-color-scheme="light"</code>.</p>
      ${swatches}
    </div>
  `,
};

export const Dark: Story = {
  name: 'Dark scheme',
  render: () => html`
    <div class="mb-theme" data-mb-color-scheme="dark" style="padding:1.5rem;background:var(--mb-color-bg);color:var(--mb-color-fg);">
      <p class="mb-title">Dark tokens</p>
      <p class="mb-body">Forced with <code>data-mb-color-scheme="dark"</code>. Also follows <code>prefers-color-scheme</code>.</p>
      ${swatches}
    </div>
  `,
};

export const CoreImportNote: Story = {
  name: 'tokens-core.css',
  render: () => html`
    <div style="max-inline-size:40rem;">
      <p class="mb-title">Host-owned document styles</p>
      <p class="mb-body">
        Import <code>@jeb-maker/mb/tokens-core.css</code> for variables + anti-FOUC without the
        global <code>html, body</code> reset. Add <code>typography.css</code> only when you want
        display fonts / <code>.mb-*</code> utilities.
      </p>
    </div>
  `,
};
