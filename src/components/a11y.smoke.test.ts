import { describe, expect, it } from 'vitest';
import { expectAccessible } from '../lib/a11y-test.js';
import './button.js';
import './input.js';
import type { MbButton } from './button.js';
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
});
