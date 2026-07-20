import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbSegmentedControl } from '../src/components/segmented-control.js';

void MbSegmentedControl;

const meta: Meta = {
  title: 'Components/SegmentedControl',
  component: 'mb-segmented-control',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Links: Story = {
  render: () => html`
    <mb-segmented-control label="Revue filters">
      <a href="#all" aria-current="page">All</a>
      <a href="#mine">Mine</a>
      <a href="#archived">Archived</a>
    </mb-segmented-control>
  `,
};
