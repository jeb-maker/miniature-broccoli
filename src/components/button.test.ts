import { describe, expect, it } from 'vitest';
import './button.js';
import type { DsButton } from './button.js';

describe('ds-button', () => {
  it('registers and renders slot content', async () => {
    const el = document.createElement('ds-button') as DsButton;
    el.textContent = 'Save';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(customElements.get('ds-button')).toBeDefined();
    const slot = el.shadowRoot!.querySelector('slot')!;
    expect(slot.assignedNodes().some((n) => n.textContent?.includes('Save'))).toBe(true);
    el.remove();
  });

  it('sets aria-busy when loading', async () => {
    const el = document.createElement('ds-button') as DsButton;
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
    expect(customElements.get('ds-button')).toBeDefined();
  });
});
