import { describe, expect, it } from 'vitest';
import './pagination.js';
import type { MbPagination } from './pagination.js';

describe('mb-pagination', () => {
  it('renders prev/next links and status', async () => {
    const el = document.createElement('mb-pagination') as MbPagination;
    el.status = 'Page 2 sur 4';
    el.prevUrl = '#1';
    el.nextUrl = '#3';
    document.body.appendChild(el);
    await el.updateComplete;

    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Pagination');
    expect(el.shadowRoot!.textContent).toContain('Page 2 sur 4');
    expect(el.shadowRoot!.querySelector('a[href="#1"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('a[href="#3"]')).toBeTruthy();
    el.remove();
  });

  it('disables edges without focusable links', async () => {
    const el = document.createElement('mb-pagination') as MbPagination;
    el.prevDisabled = true;
    el.nextDisabled = true;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('a').length).toBe(0);
    expect(el.shadowRoot!.querySelectorAll('[aria-disabled="true"]').length).toBe(2);
    el.remove();
  });
});
