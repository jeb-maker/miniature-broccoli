import { describe, expect, it } from 'vitest';
import './avatar.js';
import type { MbAvatar } from './avatar.js';

describe('mb-avatar', () => {
  it('shows initials when src is missing', async () => {
    const el = document.createElement('mb-avatar') as MbAvatar;
    el.name = 'Ada Lovelace';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).toContain('AL');
    expect(el.shadowRoot!.querySelector('img')).toBeNull();
    el.remove();
  });

  it('falls back to initials when image errors', async () => {
    const el = document.createElement('mb-avatar') as MbAvatar;
    el.name = 'Grace Hopper';
    el.src = 'https://example.invalid/missing.png';
    el.alt = '';
    document.body.appendChild(el);
    await el.updateComplete;
    const img = el.shadowRoot!.querySelector('img')!;
    img.dispatchEvent(new Event('error'));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).toContain('GH');
    expect(el.shadowRoot!.querySelector('img')).toBeNull();
    el.remove();
  });
});
