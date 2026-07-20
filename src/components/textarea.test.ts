import { describe, expect, it } from 'vitest';
import './textarea.js';
import type { MbTextarea } from './textarea.js';

describe('mb-textarea', () => {
  it('fires mb-input on keystroke and mb-change on commit', async () => {
    const el = document.createElement('mb-textarea') as MbTextarea;
    document.body.appendChild(el);
    await el.updateComplete;

    const inputs: string[] = [];
    const changes: string[] = [];
    el.addEventListener('mb-input', (e) => inputs.push((e as CustomEvent).detail.value));
    el.addEventListener('mb-change', (e) => changes.push((e as CustomEvent).detail.value));

    const control = el.shadowRoot!.querySelector('textarea')!;
    control.value = 'hello';
    control.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('hello');
    expect(inputs).toEqual(['hello']);
    expect(changes).toEqual([]);

    control.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;
    expect(changes).toEqual(['hello']);
    el.remove();
  });

  it('participates in FormData when named and validates required', async () => {
    const form = document.createElement('form');
    const el = document.createElement('mb-textarea') as MbTextarea;
    el.name = 'bio';
    el.required = true;
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;
    await el.updateComplete;

    expect(form.checkValidity()).toBe(false);

    el.value = 'Some text';
    await el.updateComplete;
    await el.updateComplete;
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('bio')).toBe('Some text');
    form.remove();
  });

  it('restores default value on form reset', async () => {
    const form = document.createElement('form');
    const el = document.createElement('mb-textarea') as MbTextarea;
    el.name = 'notes';
    el.value = 'initial';
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;

    el.value = 'edited';
    await el.updateComplete;
    form.reset();
    await el.updateComplete;
    await el.updateComplete;

    expect(el.value).toBe('initial');
    form.remove();
  });

  it('applies rows and shows hint/error accessibly', async () => {
    const el = document.createElement('mb-textarea') as MbTextarea;
    el.rows = 8;
    el.hint = 'Optional details';
    document.body.appendChild(el);
    await el.updateComplete;

    const control = el.shadowRoot!.querySelector('textarea')!;
    expect(control.rows).toBe(8);
    expect(control.getAttribute('aria-describedby')).toBe('hint');
    expect(el.shadowRoot!.querySelector('#hint')!.textContent).toContain('Optional details');

    el.error = 'Too long';
    await el.updateComplete;
    expect(control.getAttribute('aria-describedby')).toBe('error');
    const error = el.shadowRoot!.querySelector('#error')!;
    expect(error.getAttribute('role')).toBe('alert');
    expect(error.textContent).toContain('Too long');
    el.remove();
  });
});
