import { describe, expect, it } from 'vitest';
import './alert.js';
import './badge.js';
import './card.js';
import type { MbAlert } from './alert.js';
import type { MbBadge } from './badge.js';
import type { MbCard } from './card.js';

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

describe('mb-card', () => {
  it('shows header and footer sections only when slotted', async () => {
    const el = document.createElement('mb-card') as MbCard;
    el.textContent = 'Body';
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.hasAttribute('data-has-header')).toBe(false);
    expect(el.hasAttribute('data-has-footer')).toBe(false);

    const header = document.createElement('span');
    header.slot = 'header';
    header.textContent = 'Title';
    el.appendChild(header);
    const footer = document.createElement('span');
    footer.slot = 'footer';
    footer.textContent = 'Actions';
    el.appendChild(footer);
    await el.updateComplete;
    await el.updateComplete;

    expect(el.hasAttribute('data-has-header')).toBe(true);
    expect(el.hasAttribute('data-has-footer')).toBe(true);

    header.remove();
    await el.updateComplete;
    await el.updateComplete;
    expect(el.hasAttribute('data-has-header')).toBe(false);
    el.remove();
  });
});
