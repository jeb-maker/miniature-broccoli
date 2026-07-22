import { describe, expect, it } from 'vitest';
import './tag.js';
import type { MbTag } from './tag.js';

describe('mb-tag', () => {
  it('renders slotted text as a span', async () => {
    const el = document.createElement('mb-tag') as MbTag;
    el.textContent = 'domain';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('span.tag')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('a')).toBeNull();
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
});
