import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbProgress } from '../src/components/progress.js';

void MbProgress;

const meta: Meta = {
  title: 'Components/Progress',
  component: 'mb-progress',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Determinate: Story = {
  render: () => html`<mb-progress label="3 / 10 done" value="3" max="10"></mb-progress>`,
};

export const Percent: Story = {
  render: () => html`<mb-progress percent="72" aria-label="Upload"></mb-progress>`,
};
