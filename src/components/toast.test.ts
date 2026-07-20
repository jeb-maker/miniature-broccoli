import { describe, expect, it } from 'vitest';
import './toast.js';
import type { MbToast } from './toast.js';

describe('mb-toast', () => {
  it('shows with status live region and hides on dismiss', async () => {
    const el = document.createElement('mb-toast') as MbToast;
    el.autoDismiss = 0;
    document.body.appendChild(el);
    await el.updateComplete;

    el.show('Saved', 'success');
    await el.updateComplete;

    expect(el.open).toBe(true);
    const region = el.shadowRoot!.querySelector('[role="status"]')!;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(el.shadowRoot!.textContent).toContain('Saved');

    el.shadowRoot!.querySelector('button')!.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.remove();
  });

  it('uses alert role for danger variant', async () => {
    const el = document.createElement('mb-toast') as MbToast;
    el.autoDismiss = 0;
    el.variant = 'danger';
    el.open = true;
    el.message = 'Failed';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[role="alert"]')).toBeTruthy();
    el.remove();
  });
});
