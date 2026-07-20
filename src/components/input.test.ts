import { describe, expect, it } from 'vitest';
import './input.js';
import './button.js';
import type { MbInput } from './input.js';

describe('mb-input', () => {
  it('updates value and emits mb-change', async () => {
    const el = document.createElement('mb-input') as MbInput;
    el.label = 'Name';
    el.name = 'name';
    document.body.appendChild(el);
    await el.updateComplete;

    const events: CustomEvent[] = [];
    el.addEventListener('mb-change', (e: Event) => events.push(e as CustomEvent));

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'Ada';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;

    expect(el.value).toBe('Ada');
    expect(events.at(-1)?.detail.value).toBe('Ada');
    el.remove();
  });

  it('respects fieldset disabled via formDisabledCallback', async () => {
    const form = document.createElement('form');
    const fieldset = document.createElement('fieldset');
    const el = document.createElement('mb-input') as MbInput;
    el.label = 'City';
    el.name = 'city';
    fieldset.appendChild(el);
    form.appendChild(fieldset);
    document.body.appendChild(form);
    await el.updateComplete;

    fieldset.disabled = true;
    el.formDisabledCallback?.(true);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.disabled).toBe(true);
    form.remove();
  });
});
