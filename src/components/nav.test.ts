import { describe, expect, it } from 'vitest';
import './nav.js';
import './nav-toggle.js';
import type { MbNav } from './nav.js';
import type { MbNavToggle } from './nav-toggle.js';

describe('mb-nav + mb-nav-toggle', () => {
  it('exposes navigational semantics for slotted links', async () => {
    const el = document.createElement('mb-nav') as MbNav;
    el.label = 'Site';
    const a = document.createElement('a');
    a.href = '/';
    a.setAttribute('aria-current', 'page');
    a.textContent = 'Home';
    el.append(a);
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('aria-label')).toBe('Site');
    el.remove();
  });

  it('toggles open on the target nav', async () => {
    const nav = document.createElement('mb-nav') as MbNav;
    nav.id = 'site-nav';
    const toggle = document.createElement('mb-nav-toggle') as MbNavToggle;
    toggle.for = 'site-nav';
    document.body.append(nav, toggle);
    await nav.updateComplete;
    await toggle.updateComplete;

    toggle.shadowRoot!.querySelector('button')!.click();
    await toggle.updateComplete;
    await nav.updateComplete;

    expect(toggle.expanded).toBe(true);
    expect(nav.open).toBe(true);
    expect(toggle.shadowRoot!.querySelector('button')!.getAttribute('aria-expanded')).toBe('true');
    nav.remove();
    toggle.remove();
  });
});
