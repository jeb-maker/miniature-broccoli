import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbBreadcrumbs } from '../src/components/breadcrumbs.js';

void MbBreadcrumbs;

const meta: Meta = {
  title: 'Components/Breadcrumbs',
  component: 'mb-breadcrumbs',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const AncestorsOnly: Story = {
  render: () => html`
    <mb-breadcrumbs
      items='[{"href":"/","label":"Home"},{"href":"/revues","label":"Revues"}]'
    ></mb-breadcrumbs>
    <h1 class="mb-title" style="margin-block-start:0.5rem;">Run detail</h1>
  `,
};

export const WithCurrent: Story = {
  render: () => html`
    <mb-breadcrumbs
      .items=${[
        { href: '/', label: 'Home' },
        { href: '/revues', label: 'Revues' },
        { label: 'This page', current: true },
      ]}
    ></mb-breadcrumbs>
  `,
};
