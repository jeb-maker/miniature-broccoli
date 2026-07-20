import { describe, expect, it } from 'vitest';
import './modal.js';
import type { MbModal } from './modal.js';

describe('mb-modal', () => {
  it('opens native dialog with showModal', async () => {
    const el = document.createElement('mb-modal') as MbModal;
    el.heading = 'Title';
    document.body.appendChild(el);
    await el.updateComplete;

    el.open = true;
    await el.updateComplete;

    const dialog = el.shadowRoot!.querySelector('dialog')!;
    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute('aria-labelledby')).toBe('title');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    el.close();
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.remove();
  });

  it('emits mb-close when closed via close()', async () => {
    const el = document.createElement('mb-modal') as MbModal;
    document.body.appendChild(el);
    await el.updateComplete;
    el.open = true;
    await el.updateComplete;

    let closed = 0;
    el.addEventListener('mb-close', () => {
      closed += 1;
    });
    el.close();
    await el.updateComplete;
    expect(closed).toBe(1);
    el.close();
    expect(closed).toBe(1);
    el.remove();
  });

  it('emits mb-close when open is set to false', async () => {
    const el = document.createElement('mb-modal') as MbModal;
    document.body.appendChild(el);
    await el.updateComplete;
    el.open = true;
    await el.updateComplete;

    let closed = 0;
    el.addEventListener('mb-close', () => {
      closed += 1;
    });
    el.open = false;
    await el.updateComplete;
    expect(closed).toBe(1);
    el.remove();
  });
});
