import { describe, expect, it } from 'vitest';
import './checkbox.js';
import type { MbCheckbox } from './checkbox.js';

async function mount(setup?: (el: MbCheckbox) => void): Promise<{ el: MbCheckbox; form: HTMLFormElement }> {
  const form = document.createElement('form');
  const el = document.createElement('mb-checkbox') as MbCheckbox;
  setup?.(el);
  form.appendChild(el);
  document.body.appendChild(form);
  await el.updateComplete;
  await el.updateComplete;
  return { el, form };
}

describe('mb-checkbox', () => {
  it('submits its value only when named and checked', async () => {
    const { el, form } = await mount((c) => {
      c.name = 'consent';
      c.checked = true;
    });

    expect(new FormData(form).get('consent')).toBe('on');

    el.checked = false;
    await el.updateComplete;
    expect(new FormData(form).get('consent')).toBeNull();
    form.remove();
  });

  it('is invalid when required and unchecked', async () => {
    const { form } = await mount((c) => {
      c.name = 'terms';
      c.required = true;
    });

    expect(form.checkValidity()).toBe(false);
    form.remove();
  });

  it('clears indeterminate and emits mb-change on user toggle', async () => {
    const { el, form } = await mount((c) => {
      c.name = 'opt';
      c.indeterminate = true;
    });

    const changes: Array<{ checked: boolean; value: string }> = [];
    el.addEventListener('mb-change', (e) => changes.push((e as CustomEvent).detail));

    const input = el.shadowRoot!.querySelector('input')!;
    input.click();
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(el.indeterminate).toBe(false);
    expect(input.indeterminate).toBe(false);
    expect(changes).toEqual([{ checked: true, value: 'on' }]);
    form.remove();
  });

  it('restores the default checked state on form reset', async () => {
    const { el, form } = await mount((c) => {
      c.name = 'news';
      c.checked = true;
    });

    el.checked = false;
    await el.updateComplete;
    form.reset();
    await el.updateComplete;

    expect(el.checked).toBe(true);
    form.remove();
  });

  it('disables the native control under fieldset[disabled]', async () => {
    const form = document.createElement('form');
    const fieldset = document.createElement('fieldset');
    const el = document.createElement('mb-checkbox') as MbCheckbox;
    el.name = 'x';
    fieldset.appendChild(el);
    form.appendChild(fieldset);
    document.body.appendChild(form);
    await el.updateComplete;

    fieldset.disabled = true;
    await el.updateComplete;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('input')!.disabled).toBe(true);
    form.remove();
  });
});
