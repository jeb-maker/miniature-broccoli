import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbToolbar } from '../src/components/toolbar.js';
import { MbInput } from '../src/components/input.js';
import { MbButton } from '../src/components/button.js';
import { MbSegmentedControl } from '../src/components/segmented-control.js';

void MbToolbar;
void MbInput;
void MbButton;
void MbSegmentedControl;

const meta: Meta = {
  title: 'Components/Toolbar',
  component: 'mb-toolbar',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const ListToolbar: Story = {
  render: () => html`
    <mb-toolbar>
      <mb-input slot="start" density="compact" hide-label aria-label="Search" placeholder="Search…" type="search"></mb-input>
      <mb-segmented-control slot="start" label="Filters">
        <a href="#all" aria-current="page">All</a>
        <a href="#mine">Mine</a>
      </mb-segmented-control>
      <mb-button slot="end" href="#new">New revue</mb-button>
    </mb-toolbar>
  `,
};
