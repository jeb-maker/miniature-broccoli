import { describe, expect, it } from 'vitest';
import './badge.js';
import type { MbBadge } from './badge.js';

describe('mb-badge', () => {
  it('reflects variant and renders slotted content', async () => {
    const el = document.createElement('mb-badge') as MbBadge;
    el.variant = 'success';
    el.textContent = 'New';
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.getAttribute('variant')).toBe('success');
    const slot = el.shadowRoot!.querySelector('slot')!;
    expect(slot.assignedNodes().some((n) => n.textContent?.includes('New'))).toBe(true);
    el.remove();
  });
});
