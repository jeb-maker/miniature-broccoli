import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbCombobox, type ComboboxOption } from '../src/components/combobox.js';
import { MbToolbar } from '../src/components/toolbar.js';

void MbCombobox;
void MbToolbar;

const GROUPED: ComboboxOption[] = [
  { value: 'math', label: 'Mathematics', group: 'Subjects' },
  { value: 'hist', label: 'History', group: 'Subjects' },
  { value: 'run-1', label: 'Weekly review', group: 'Runs', href: '/runs/1' },
  { value: 'run-2', label: 'Sprint retro', group: 'Runs', href: '/runs/2' },
  { value: 'tpl', label: 'Template A', group: 'Templates' },
];

const meta: Meta = {
  title: 'Components/Combobox',
  component: 'mb-combobox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Typeahead suggestions over a text/search field. Hosts filter asynchronously via `mb-input` and set `.options` / `loading`. Keyboard: ↑↓ Enter Esc Home/End. Selection emits `mb-select` (`value`, `label`, `href?`) and `mb-change`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-combobox
      label="Search"
      placeholder="Subjects, runs, templates…"
      .options=${GROUPED}
    ></mb-combobox>
  `,
};

export const AsyncSearch: Story = {
  name: 'Async search (debounced)',
  render: () => {
    const all = GROUPED;
    let timer = 0;

    return html`
      <mb-combobox
        label="Live search"
        placeholder="Type to filter…"
        empty-message="Aucun résultat"
        loading-message="Chargement…"
        @mb-input=${(event: Event) => {
          const el = event.currentTarget as MbCombobox;
          const query = (event as CustomEvent<{ value: string }>).detail.value.trim().toLowerCase();
          window.clearTimeout(timer);
          el.loading = true;
          el.open = true;
          timer = window.setTimeout(() => {
            el.options = query
              ? all.filter(
                  (opt) =>
                    opt.label.toLowerCase().includes(query) ||
                    opt.value.toLowerCase().includes(query) ||
                    (opt.group ?? '').toLowerCase().includes(query),
                )
              : all;
            el.loading = false;
          }, 280);
        }}
      ></mb-combobox>
    `;
  },
};

export const LoadingAndEmpty: Story = {
  name: 'Loading + empty',
  render: () => html`
    <div style="display:grid;gap:1.5rem;max-inline-size:28rem;">
      <mb-combobox
        label="Loading"
        open
        loading
        loading-message="Chargement…"
        .options=${[]}
      ></mb-combobox>
      <mb-combobox
        label="Empty"
        open
        empty-message="Aucun résultat"
        .options=${[]}
      ></mb-combobox>
    </div>
  `,
};

export const CompactToolbar: Story = {
  name: 'Compact / toolbar',
  render: () => html`
    <mb-toolbar>
      <mb-combobox
        slot="start"
        density="compact"
        hide-label
        aria-label="Search"
        placeholder="Search…"
        .options=${GROUPED}
      ></mb-combobox>
    </mb-toolbar>
  `,
};

export const SlottedOptions: Story = {
  name: 'Slotted options (SSR)',
  render: () => html`
    <mb-combobox label="Jump to" placeholder="Filter…" open>
      <option value="ops" data-group="Sections">Ops</option>
      <option value="qa" data-group="Sections">QA</option>
      <option value="r1" data-group="Runs" data-href="/runs/1">Run 1</option>
    </mb-combobox>
  `,
};

export const JsonOptions: Story = {
  name: 'JSON options attribute',
  render: () => html`
    <mb-combobox
      label="Priority"
      open
      options='[{"value":"low","label":"Low","group":"Level"},{"value":"high","label":"High","group":"Level"}]'
    ></mb-combobox>
  `,
};
