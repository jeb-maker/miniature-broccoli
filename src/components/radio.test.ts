import { describe, expect, it } from 'vitest';
import './radio.js';
import type { MbRadio } from './radio.js';

describe('mb-radio', () => {
  it('emits mb-radio-select when chosen', async () => {
    const el = document.createElement('mb-radio') as MbRadio;
    el.value = 'ops';
    el.label = 'Ops';
    el.name = 'team';
    document.body.appendChild(el);
    await el.updateComplete;

    const events: CustomEvent<{ value: string }>[] = [];
    el.addEventListener('mb-radio-select', (e) =>
      events.push(e as CustomEvent<{ value: string }>),
    );

    el.shadowRoot!.querySelector('input')!.click();
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(events.at(-1)?.detail.value).toBe('ops');
    el.remove();
  });

  it('focuses the inner input via focus()', async () => {
    const el = document.createElement('mb-radio') as MbRadio;
    el.label = 'Focus me';
    el.value = 'a';
    document.body.appendChild(el);
    await el.updateComplete;

    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector('input'));
    el.remove();
  });
});
