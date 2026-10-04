import { describe, expect, it } from 'vitest';
import { expectAccessible } from '../lib/a11y-test.js';
import './button.js';
import './combobox.js';
import './input.js';
import type { MbButton } from './button.js';
import type { MbCombobox } from './combobox.js';
import type { MbInput } from './input.js';

describe('a11y smoke', () => {
  it('mb-button has no axe violations', async () => {
    const el = document.createElement('mb-button') as MbButton;
    el.textContent = 'Save';
    document.body.appendChild(el);
    await el.updateComplete;

    await expectAccessible(el);
    expect(el.shadowRoot?.querySelector('button')).toBeTruthy();
    el.remove();
  });

  it('mb-input has no axe violations', async () => {
    const el = document.createElement('mb-input') as MbInput;
    el.label = 'Email';
    el.name = 'email';
    el.type = 'email';
    document.body.appendChild(el);
    await el.updateComplete;

    await expectAccessible(el);
    expect(el.shadowRoot?.querySelector('input')).toBeTruthy();
    el.remove();
  });

  it('mb-combobox has no axe violations when open', async () => {
    const el = document.createElement('mb-combobox') as MbCombobox;
    el.label = 'Search';
    el.open = true;
    el.options = [
      { value: 'a', label: 'Alpha', group: 'Letters' },
      { value: 'b', label: 'Beta', group: 'Letters' },
    ];
    document.body.appendChild(el);
    await el.updateComplete;

    await expectAccessible(el);
    expect(el.shadowRoot?.querySelector('[role="combobox"]')).toBeTruthy();
    el.remove();
  });
});
