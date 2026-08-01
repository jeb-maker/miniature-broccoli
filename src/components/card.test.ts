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
