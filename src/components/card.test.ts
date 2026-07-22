import { describe, expect, it } from 'vitest';
import './card.js';
import type { MbCard } from './card.js';

describe('mb-card', () => {
  it('registers without relying on anti-FOUC hide for layout', async () => {
    const el = document.createElement('mb-card') as MbCard;
    el.innerHTML = '<p>Readable before upgrade intent</p>';
    document.body.appendChild(el);
    await el.updateComplete;
    expect(customElements.get('mb-card')).toBeDefined();
    expect(el.shadowRoot!.querySelector('.card')).toBeTruthy();
    el.remove();
  });
});
