import { describe, expect, it } from 'vitest';
import './empty-state.js';
import type { MbEmptyState } from './empty-state.js';

describe('mb-empty-state', () => {
  it('renders heading and default slot', async () => {
    const el = document.createElement('mb-empty-state') as MbEmptyState;
    el.heading = 'Nothing here';
    el.textContent = 'Add an item to get started.';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).toContain('Nothing here');
    const slot = el.shadowRoot!.querySelector('slot:not([name])')!;
    expect(slot.assignedNodes().some((n) => n.textContent?.includes('Add an item'))).toBe(true);
    el.remove();
  });
});
