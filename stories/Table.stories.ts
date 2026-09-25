import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbTable, MbTableRow, MbTableCell } from '../src/components/table.js';
import { MbInput } from '../src/components/input.js';
import { MbSelect } from '../src/components/select.js';
import { MbButton } from '../src/components/button.js';
import { MbEmptyState } from '../src/components/empty-state.js';
import { MbBadge } from '../src/components/badge.js';

void MbTable;
void MbTableRow;
void MbTableCell;
void MbInput;
void MbSelect;
void MbButton;
void MbEmptyState;
void MbBadge;

const meta: Meta = {
  title: 'Components/Table',
  component: 'mb-table',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Responsive editable table: wide viewports use a grid; below `36rem` each row becomes a labeled card. Pass `sections` and set `section` on rows to group; head cells with `sort-key` sort within each section; `reorderable` enables drag handles.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

const statusOptions = [
  { value: 'todo', label: 'Todo' },
  { value: 'doing', label: 'Doing' },
  { value: 'done', label: 'Done' },
];

export const Editable: Story = {
  name: 'Editable (auto layout)',
  render: () => html`
    <mb-table label="Tasks" density="compact" columns="2fr 1fr auto">
      <mb-table-row slot="head">
        <mb-table-cell>Title</mb-table-cell>
        <mb-table-cell>Status</mb-table-cell>
        <mb-table-cell></mb-table-cell>
      </mb-table-row>

      <mb-table-row>
        <mb-table-cell primary>
          <mb-input
            name="title-1"
            value="Wire HTMX save"
            density="compact"
            hide-label
            aria-label="Title"
          ></mb-input>
        </mb-table-cell>
        <mb-table-cell>
          <mb-select
            name="status-1"
            value="doing"
            density="compact"
            hide-label
            aria-label="Status"
            .options=${statusOptions}
          ></mb-select>
        </mb-table-cell>
        <mb-table-cell align="end">
          <mb-button size="sm" type="button">Save</mb-button>
        </mb-table-cell>
      </mb-table-row>

      <mb-table-row>
        <mb-table-cell primary>
          <mb-input
            name="title-2"
            value="Mobile card layout"
            density="compact"
            hide-label
            aria-label="Title"
          ></mb-input>
        </mb-table-cell>
        <mb-table-cell>
          <mb-select
            name="status-2"
            value="todo"
            density="compact"
            hide-label
            aria-label="Status"
            .options=${statusOptions}
          ></mb-select>
        </mb-table-cell>
        <mb-table-cell align="end">
          <mb-button size="sm" type="button">Save</mb-button>
        </mb-table-cell>
      </mb-table-row>
    </mb-table>
  `,
};

export const CardsForced: Story = {
  name: 'Cards (forced)',
  render: () => html`
    <div style="max-inline-size: 24rem;">
      <mb-table label="Assignees" layout="cards" density="compact" columns="1fr auto">
        <mb-table-row slot="head">
          <mb-table-cell>Person</mb-table-cell>
          <mb-table-cell>Role</mb-table-cell>
        </mb-table-row>
        <mb-table-row>
          <mb-table-cell primary>
            <mb-input
              name="person"
              value="Ada Lovelace"
              density="compact"
              hide-label
              aria-label="Person"
            ></mb-input>
          </mb-table-cell>
          <mb-table-cell>
            <mb-badge variant="info">Owner</mb-badge>
          </mb-table-cell>
        </mb-table-row>
        <mb-table-row>
          <mb-table-cell primary>
            <mb-input
              name="person-2"
              value="Grace Hopper"
              density="compact"
              hide-label
              aria-label="Person"
            ></mb-input>
          </mb-table-cell>
          <mb-table-cell>
            <mb-badge>Reviewer</mb-badge>
          </mb-table-cell>
        </mb-table-row>
      </mb-table>
    </div>
  `,
};

export const ReadOnly: Story = {
  name: 'Read-only rows',
  render: () => html`
    <mb-table label="Deployments" columns="1.5fr 1fr 1fr">
      <mb-table-row slot="head">
        <mb-table-cell>Service</mb-table-cell>
        <mb-table-cell>Env</mb-table-cell>
        <mb-table-cell>Version</mb-table-cell>
      </mb-table-row>
      <mb-table-row>
        <mb-table-cell primary>portal-website</mb-table-cell>
        <mb-table-cell>production</mb-table-cell>
        <mb-table-cell>1.4.2</mb-table-cell>
      </mb-table-row>
      <mb-table-row>
        <mb-table-cell primary>api</mb-table-cell>
        <mb-table-cell>staging</mb-table-cell>
        <mb-table-cell>1.5.0-rc.1</mb-table-cell>
      </mb-table-row>
    </mb-table>
  `,
};

export const Empty: Story = {
  render: () => html`
    <mb-table label="Tasks" columns="2fr 1fr auto">
      <mb-table-row slot="head">
        <mb-table-cell>Title</mb-table-cell>
        <mb-table-cell>Status</mb-table-cell>
        <mb-table-cell></mb-table-cell>
      </mb-table-row>
      <mb-empty-state slot="empty" heading="No tasks yet">
        Create a row to start editing inline.
        <mb-button slot="actions" size="sm">Add task</mb-button>
      </mb-empty-state>
    </mb-table>
  `,
};

const demoSections = [
  { id: 'ops', label: 'Ops' },
  { id: 'eng', label: 'Engineering' },
];

export const SectionsAndSort: Story = {
  name: 'Sections + sort + drag',
  render: () => html`
    <mb-table
      label="Backlog"
      density="compact"
      columns="2fr 1fr auto"
      reorderable
      .sections=${demoSections}
    >
      <mb-table-row slot="head">
        <mb-table-cell sort-key="title">Title</mb-table-cell>
        <mb-table-cell sort-key="status">Status</mb-table-cell>
        <mb-table-cell></mb-table-cell>
      </mb-table-row>

      <mb-table-row id="row-ops-1" section="ops">
        <mb-table-cell primary sort-value="Wire HTMX save">
          <mb-input
            name="t1"
            value="Wire HTMX save"
            density="compact"
            hide-label
            aria-label="Title"
          ></mb-input>
        </mb-table-cell>
        <mb-table-cell sort-value="doing">
          <mb-select
            name="s1"
            value="doing"
            density="compact"
            hide-label
            aria-label="Status"
            .options=${statusOptions}
          ></mb-select>
        </mb-table-cell>
        <mb-table-cell align="end">
          <mb-button size="sm">Save</mb-button>
        </mb-table-cell>
      </mb-table-row>

      <mb-table-row id="row-eng-1" section="eng">
        <mb-table-cell primary sort-value="Mobile card layout">
          <mb-input
            name="t2"
            value="Mobile card layout"
            density="compact"
            hide-label
            aria-label="Title"
          ></mb-input>
        </mb-table-cell>
        <mb-table-cell sort-value="todo">
          <mb-select
            name="s2"
            value="todo"
            density="compact"
            hide-label
            aria-label="Status"
            .options=${statusOptions}
          ></mb-select>
        </mb-table-cell>
        <mb-table-cell align="end">
          <mb-button size="sm">Save</mb-button>
        </mb-table-cell>
      </mb-table-row>

      <mb-table-row id="row-ops-2" section="ops">
        <mb-table-cell primary sort-value="Pager rotation">
          <mb-input
            name="t3"
            value="Pager rotation"
            density="compact"
            hide-label
            aria-label="Title"
          ></mb-input>
        </mb-table-cell>
        <mb-table-cell sort-value="done">
          <mb-select
            name="s3"
            value="done"
            density="compact"
            hide-label
            aria-label="Status"
            .options=${statusOptions}
          ></mb-select>
        </mb-table-cell>
        <mb-table-cell align="end">
          <mb-button size="sm">Save</mb-button>
        </mb-table-cell>
      </mb-table-row>

      <mb-table-row id="row-eng-2" section="eng">
        <mb-table-cell primary sort-value="Design tokens">
          <mb-input
            name="t4"
            value="Design tokens"
            density="compact"
            hide-label
            aria-label="Title"
          ></mb-input>
        </mb-table-cell>
        <mb-table-cell sort-value="doing">
          <mb-select
            name="s4"
            value="doing"
            density="compact"
            hide-label
            aria-label="Status"
            .options=${statusOptions}
          ></mb-select>
        </mb-table-cell>
        <mb-table-cell align="end">
          <mb-button size="sm">Save</mb-button>
        </mb-table-cell>
      </mb-table-row>
    </mb-table>
  `,
};
