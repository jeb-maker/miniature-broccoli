import { describe, expect, it } from 'vitest';
import './button.js';
import type { MbButton } from './button.js';

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
