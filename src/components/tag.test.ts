import { describe, expect, it } from 'vitest';
import './tag.js';
import type { MbTag } from './tag.js';
import { MbBadge } from './badge.js';

describe('mb-tag', () => {
  it('is a badge alias that defaults to size md', async () => {
    const el = document.createElement('mb-tag') as MbTag;
    el.textContent = 'domain';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el).toBeInstanceOf(MbBadge);
    expect(el.size).toBe('md');
    expect(el.shadowRoot!.querySelector('.chip')).toBeTruthy();
    el.remove();
  });

  it('renders as an anchor when href is set', async () => {
    const el = document.createElement('mb-tag') as MbTag;
    el.href = '/tags/domain';
    el.textContent = 'domain';
    document.body.appendChild(el);
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector('a')!;
    expect(a.getAttribute('href')).toBe('/tags/domain');
    el.remove();
  });

  it('honors an explicit size attribute over the md default', async () => {
    const el = document.createElement('mb-tag') as MbTag;
    el.setAttribute('size', 'sm');
    el.textContent = 'tiny';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.size).toBe('sm');
    el.remove();
  });
});
