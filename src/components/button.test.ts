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
});
