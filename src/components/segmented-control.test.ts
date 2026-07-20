import { describe, expect, it } from 'vitest';
import './segmented-control.js';
import type { MbSegmentedControl } from './segmented-control.js';

describe('mb-segmented-control', () => {
  it('exposes navigational semantics for slotted links', async () => {
    const el = document.createElement('mb-segmented-control') as MbSegmentedControl;
    el.label = 'Filters';
    const a = document.createElement('a');
    a.href = '#all';
    a.setAttribute('aria-current', 'page');
    a.textContent = 'All';
    const b = document.createElement('a');
    b.href = '#mine';
    b.textContent = 'Mine';
    el.append(a, b);
    document.body.appendChild(el);
    await el.updateComplete;

    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Filters');
    const slot = el.shadowRoot!.querySelector('slot')!;
    expect(slot.assignedElements()).toHaveLength(2);
    el.remove();
  });
});
