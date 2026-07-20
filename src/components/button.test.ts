import { describe, expect, it } from 'vitest';
import './button.js';
import './input.js';
import type { MbButton } from './button.js';
import type { MbInput } from './input.js';

describe('mb-button', () => {
  it('registers and renders slot content', async () => {
    const el = document.createElement('mb-button') as MbButton;
    el.textContent = 'Save';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(customElements.get('mb-button')).toBeDefined();
    const slot = el.shadowRoot!.querySelector('slot')!;
    expect(slot.assignedNodes().some((n) => n.textContent?.includes('Save'))).toBe(true);
    el.remove();
  });

  it('sets aria-busy when loading', async () => {
    const el = document.createElement('mb-button') as MbButton;
    el.loading = true;
    document.body.appendChild(el);
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.disabled).toBe(true);
    el.remove();
  });

  it('safeDefine is idempotent', async () => {
    await import('./button.js');
    expect(customElements.get('mb-button')).toBeDefined();
  });

  it('submit click requests form submit with name/value only for that submit', async () => {
    const form = document.createElement('form');
    form.addEventListener('submit', (e) => e.preventDefault());
    const el = document.createElement('mb-button') as MbButton;
    el.type = 'submit';
    el.name = 'action';
    el.value = 'save';
    el.textContent = 'Save';
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;

    let submitted: FormData | null = null;
    form.addEventListener('submit', () => {
      submitted = new FormData(form);
    });

    el.shadowRoot!.querySelector('button')!.click();
    await Promise.resolve();
    await Promise.resolve();

    expect(submitted).not.toBeNull();
    expect(submitted!.get('action')).toBe('save');
    form.remove();
  });

  it('renders danger variant and link when href is set', async () => {
    const el = document.createElement('mb-button') as MbButton;
    el.variant = 'danger';
    el.href = '/archive';
    el.textContent = 'Archive';
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.getAttribute('variant')).toBe('danger');
    const anchor = el.shadowRoot!.querySelector('a')!;
    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/archive');
    expect(el.shadowRoot!.querySelector('button')).toBeNull();
    el.remove();
  });

  it('disabled link is not navigable', async () => {
    const el = document.createElement('mb-button') as MbButton;
    el.href = '/x';
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;
    const anchor = el.shadowRoot!.querySelector('a')!;
    expect(anchor.getAttribute('href')).toBeNull();
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    el.remove();
  });
});

describe('mb-input form semantics', () => {
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
