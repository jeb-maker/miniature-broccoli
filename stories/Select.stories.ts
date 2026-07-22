import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbSelect } from '../src/components/select.js';

void MbSelect;

const meta: Meta = {
  title: 'Components/Select',
  component: 'mb-select',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <mb-select
      label="Country"
      .options=${[
        { value: 'fr', label: 'France' },
        { value: 'ca', label: 'Canada' },
        { value: 'be', label: 'Belgium' },
      ]}
    ></mb-select>
  `,
};

export const SlottedOptions: Story = {
  name: 'Slotted options (SSR)',
  render: () => html`
    <mb-select label="Status" name="status" value="ok">
      <option value="ok">OK</option>
      <option value="ko">KO</option>
      <option value="na" disabled>N/A</option>
    </mb-select>
  `,
};

export const JsonOptions: Story = {
  name: 'JSON options attribute',
  render: () => html`
    <mb-select
      label="Priority"
      options='[{"value":"low","label":"Low"},{"value":"high","label":"High"}]'
      value="high"
    ></mb-select>
  `,
};

export const CompactTableCell: Story = {
  name: 'Compact / unlabeled',
  render: () => html`
    <div style="display:grid;grid-template-columns:8rem 1fr;gap:0.5rem;align-items:center;max-inline-size:24rem;">
      <span class="mb-body-sm">Assignee</span>
      <mb-select
        density="compact"
        hide-label
        aria-label="Assignee"
        value="a"
        .options=${[
          { value: 'a', label: 'Ada' },
          { value: 'b', label: 'Baz' },
        ]}
      ></mb-select>
    </div>
  `,
};

export const PlaceholderEmpty: Story = {
  name: 'Placeholder empty option',
  render: () => html`
    <mb-select
      label="Status"
      placeholder="Tous"
      density="compact"
      .options=${[
        { value: 'todo', label: 'Todo' },
        { value: 'done', label: 'Done' },
      ]}
    ></mb-select>
  `,
};

export const SlottedEmptyLabel: Story = {
  name: 'Slotted empty label',
  render: () => html`
    <mb-select label="Section" name="section" density="compact">
      <option value="">Toutes</option>
      <option value="ops">Ops</option>
      <option value="qa">QA</option>
    </mb-select>
  `,
};
