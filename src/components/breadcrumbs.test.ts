import { describe, expect, it } from 'vitest';
import './breadcrumbs.js';
import type { MbBreadcrumbs } from './breadcrumbs.js';

describe('mb-breadcrumbs', () => {
  it('renders items as links with nav label', async () => {
    const el = document.createElement('mb-breadcrumbs') as MbBreadcrumbs;
    el.items = [
      { href: '/', label: 'Home' },
      { href: '/revues', label: 'Revues' },
    ];
    document.body.appendChild(el);
    await el.updateComplete;
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(el.shadowRoot!.querySelectorAll('a')).toHaveLength(2);
    el.remove();
  });

  it('marks current crumb without requiring a link', async () => {
    const el = document.createElement('mb-breadcrumbs') as MbBreadcrumbs;
    el.items = [
      { href: '/', label: 'Home' },
      { label: 'Current', current: true },
    ];
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[aria-current="page"]')!.textContent).toContain('Current');
    expect(el.shadowRoot!.querySelectorAll('a')).toHaveLength(1);
    el.remove();
  });
});
