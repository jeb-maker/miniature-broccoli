import { describe, expect, it } from 'vitest';
import './input.js';
import type { MbInput } from './input.js';

describe('mb-input', () => {
  it('updates value and emits mb-input', async () => {
    const el = document.createElement('mb-input') as MbInput;
    el.label = 'Name';
    el.name = 'name';
    document.body.appendChild(el);
    await el.updateComplete;

    const events: CustomEvent[] = [];
    el.addEventListener('mb-input', (e: Event) => events.push(e as CustomEvent));

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

    expect(typeof el.formDisabledCallback).toBe('function');
    fieldset.disabled = true;
    el.formDisabledCallback(true);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.disabled).toBe(true);
    form.remove();
  });

  it('omits FormData entry when name is empty', async () => {
    const form = document.createElement('form');
    const el = document.createElement('mb-input') as MbInput;
    el.value = 'orphan';
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;
    await el.updateComplete;

    const data = new FormData(form);
    expect([...data.keys()]).toEqual([]);
    form.remove();
  });

  it('includes FormData entry when named', async () => {
    const form = document.createElement('form');
    const el = document.createElement('mb-input') as MbInput;
    el.name = 'email';
    el.value = 'a@b.c';
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;
    await el.updateComplete;

    expect(new FormData(form).get('email')).toBe('a@b.c');
    form.remove();
  });

  it('associates with form attribute outside the form element', async () => {
    const form = document.createElement('form');
    form.id = 'outer-form';
    const el = document.createElement('mb-input') as MbInput;
    el.setAttribute('form', 'outer-form');
    el.name = 'note';
    el.value = 'hello';
    document.body.append(form, el);
    await el.updateComplete;
    await el.updateComplete;

    expect(new FormData(form).get('note')).toBe('hello');
    el.remove();
    form.remove();
  });

  it('supports number type attributes', async () => {
    const el = document.createElement('mb-input') as MbInput;
    el.type = 'number';
    el.min = '1';
    el.max = '10';
    el.step = '1';
    el.value = '5';
    document.body.appendChild(el);
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.type).toBe('number');
    expect(input.min).toBe('1');
    expect(input.max).toBe('10');
    el.remove();
  });

  it('fires mb-input on keystroke and mb-change on commit', async () => {
    const el = document.createElement('mb-input') as MbInput;
    document.body.appendChild(el);
    await el.updateComplete;

    const inputs: string[] = [];
    const changes: string[] = [];
    el.addEventListener('mb-input', (e) => inputs.push((e as CustomEvent).detail.value));
    el.addEventListener('mb-change', (e) => changes.push((e as CustomEvent).detail.value));

    const control = el.shadowRoot!.querySelector('input')!;
    control.value = 'x';
    control.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(inputs).toEqual(['x']);
    expect(changes).toEqual([]);

    control.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;
    expect(changes).toEqual(['x']);
    el.remove();
  });

  it('restores default value on reset and keeps required field visually valid until touched', async () => {
    const form = document.createElement('form');
    const el = document.createElement('mb-input') as MbInput;
    el.name = 'city';
    el.required = true;
    el.value = 'Paris';
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;

    el.value = 'Lyon';
    await el.updateComplete;
    form.reset();
    await el.updateComplete;
    await el.updateComplete;

    expect(el.value).toBe('Paris');
    expect(el.invalid).toBe(false);
    form.remove();
  });
});
