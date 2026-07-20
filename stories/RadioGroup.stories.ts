import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbRadioGroup } from '../src/components/radio-group.js';
import { MbRadio } from '../src/components/radio.js';

void MbRadioGroup;
void MbRadio;

const meta: Meta = {
  title: 'Components/RadioGroup',
  component: 'mb-radio-group',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Slotted: Story = {
  render: () => html`
    <mb-radio-group name="org" label="Organization" value="a" required>
      <mb-radio value="a">Acme</mb-radio>
      <mb-radio value="b">Beta Co</mb-radio>
    </mb-radio-group>
  `,
};

export const JsonOptions: Story = {
  render: () => html`
    <mb-radio-group
      name="jira"
      label="Jira"
      value="cloud"
      options='[{"value":"cloud","label":"Cloud"},{"value":"server","label":"Server"}]'
    ></mb-radio-group>
  `,
};
