import { describe, expect, it } from 'vitest';
import './toolbar.js';
import type { MbToolbar } from './toolbar.js';

describe('mb-toolbar', () => {
  it('projects start and end slots', async () => {
    const el = document.createElement('mb-toolbar') as MbToolbar;
    const start = document.createElement('span');
    start.slot = 'start';
    start.textContent = 'filters';
    const end = document.createElement('span');
    end.slot = 'end';
    end.textContent = 'cta';
    el.append(start, end);
    document.body.appendChild(el);
    await el.updateComplete;
    const slots = [...el.shadowRoot!.querySelectorAll('slot')];
    expect(slots.some((s) => s.name === 'start')).toBe(true);
    expect(slots.some((s) => s.name === 'end')).toBe(true);
    el.remove();
  });
});
