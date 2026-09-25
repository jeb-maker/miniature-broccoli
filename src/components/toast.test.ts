import { describe, expect, it, vi } from 'vitest';
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

  it('restarts auto-dismiss when an open toast is shown again', async () => {
    vi.useFakeTimers();
    try {
      const el = document.createElement('mb-toast') as MbToast;
      el.autoDismiss = 4000;
      document.body.appendChild(el);
      await el.updateComplete;

      el.show('First');
      vi.advanceTimersByTime(3000);
      el.show('Second');
      vi.advanceTimersByTime(1500);
      expect(el.open).toBe(true);

      vi.advanceTimersByTime(2500);
      expect(el.open).toBe(false);
      el.remove();
    } finally {
      vi.useRealTimers();
    }
  });
});
