import { describe, expect, it } from 'vitest';
import './nav.js';
import './nav-toggle.js';
import type { MbNav } from './nav.js';
import type { MbNavToggle } from './nav-toggle.js';

describe('mb-nav-toggle', () => {
  it('emits mb-toggle with expanded detail', async () => {
    const nav = document.createElement('mb-nav') as MbNav;
    nav.id = 'toggle-nav';
    const toggle = document.createElement('mb-nav-toggle') as MbNavToggle;
    toggle.for = 'toggle-nav';
    document.body.append(nav, toggle);
    await nav.updateComplete;
    await toggle.updateComplete;

    const events: CustomEvent<{ expanded: boolean }>[] = [];
    toggle.addEventListener('mb-toggle', (e) =>
      events.push(e as CustomEvent<{ expanded: boolean }>),
    );

    toggle.shadowRoot!.querySelector('button')!.click();
    await toggle.updateComplete;

    expect(events).toHaveLength(1);
    expect(events[0].detail.expanded).toBe(true);
    expect(toggle.shadowRoot!.querySelector('button')!.getAttribute('aria-label')).toBe(
      'Close menu',
    );

    nav.remove();
    toggle.remove();
  });

  it('honors i18n open/close labels', async () => {
    const toggle = document.createElement('mb-nav-toggle') as MbNavToggle;
    toggle.labelOpen = 'Menu';
    toggle.labelClose = 'Fermer';
    document.body.appendChild(toggle);
    await toggle.updateComplete;

    const button = toggle.shadowRoot!.querySelector('button')!;
    expect(button.getAttribute('aria-label')).toBe('Menu');
    toggle.expanded = true;
    await toggle.updateComplete;
    expect(button.getAttribute('aria-label')).toBe('Fermer');
    toggle.remove();
  });
});
