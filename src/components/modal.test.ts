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
    el.close();
    await el.updateComplete;
    expect(el.open).toBe(false);
    el.remove();
  });

  it('emits mb-close when closed', async () => {
    const el = document.createElement('mb-modal') as MbModal;
    document.body.appendChild(el);
    await el.updateComplete;
    el.open = true;
    await el.updateComplete;

    let closed = false;
    el.addEventListener('mb-close', () => {
      closed = true;
    });
    el.close();
    expect(closed).toBe(true);
    el.remove();
  });
});
