import { describe, expect, it } from 'vitest';
import './spinner.js';
import type { MbSpinner } from './spinner.js';

describe('mb-spinner', () => {
  it('exposes a status live region', async () => {
    const el = document.createElement('mb-spinner') as MbSpinner;
    el.label = 'Saving';
    document.body.appendChild(el);
    await el.updateComplete;
    const status = el.shadowRoot!.querySelector('[role="status"]')!;
    expect(status.getAttribute('aria-label')).toBe('Saving');
    el.remove();
  });
});
