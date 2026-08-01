import { describe, expect, it } from 'vitest';
import './alert.js';
import type { MbAlert } from './alert.js';

describe('mb-alert', () => {
  it('uses role=status for info/success and role=alert for warning/danger', async () => {
    const el = document.createElement('mb-alert') as MbAlert;
    el.textContent = 'Saved';
    document.body.appendChild(el);
    await el.updateComplete;

    const base = () => el.shadowRoot!.querySelector('.alert')!;
    expect(base().getAttribute('role')).toBe('status');

    el.variant = 'success';
    await el.updateComplete;
    expect(base().getAttribute('role')).toBe('status');

    el.variant = 'warning';
    await el.updateComplete;
    expect(base().getAttribute('role')).toBe('alert');

    el.variant = 'danger';
    await el.updateComplete;
    expect(base().getAttribute('role')).toBe('alert');
    expect(el.getAttribute('variant')).toBe('danger');
    el.remove();
  });
});
