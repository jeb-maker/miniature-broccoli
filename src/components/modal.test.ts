import { describe, expect, it } from 'vitest';
import './modal.js';
import type { DsModal } from './modal.js';

describe('ds-modal', () => {
  it('opens native dialog with showModal', async () => {
    const el = document.createElement('ds-modal') as DsModal;
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

  it('emits ds-close when closed', async () => {
    const el = document.createElement('ds-modal') as DsModal;
    document.body.appendChild(el);
    await el.updateComplete;
    el.open = true;
    await el.updateComplete;

    let closed = false;
    el.addEventListener('ds-close', () => {
      closed = true;
    });
    el.close();
    expect(closed).toBe(true);
    el.remove();
  });
});
