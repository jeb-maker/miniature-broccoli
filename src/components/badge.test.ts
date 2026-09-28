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

  it('renders as an anchor when href is set', async () => {
    const el = document.createElement('mb-badge') as MbBadge;
    el.href = '/tags/domain';
    el.size = 'md';
    el.textContent = 'domain';
    document.body.appendChild(el);
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector('a.chip')!;
    expect(a.getAttribute('href')).toBe('/tags/domain');
    expect(el.getAttribute('size')).toBe('md');
    el.remove();
  });

  it('defaults to compact sm size', async () => {
    const el = document.createElement('mb-badge') as MbBadge;
    el.textContent = 'ok';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.size).toBe('sm');
    const chip = el.shadowRoot!.querySelector('.chip')!;
    expect(parseFloat(getComputedStyle(chip).minHeight)).toBeLessThan(32);
    el.remove();
  });
});
