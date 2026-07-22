import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MbAvatar } from '../src/components/avatar.js';

void MbAvatar;

const meta: Meta = {
  title: 'Components/Avatar',
  component: 'mb-avatar',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Initials: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;align-items:center;">
      <mb-avatar name="Ada Lovelace" size="sm"></mb-avatar>
      <mb-avatar name="Grace Hopper"></mb-avatar>
      <span class="mb-body">Grace Hopper</span>
    </div>
  `,
};

export const Image: Story = {
  render: () => html`
    <mb-avatar
      src="https://avatars.githubusercontent.com/u/9919?s=64&amp;v=4"
      name="GitHub"
      alt=""
    ></mb-avatar>
  `,
};
