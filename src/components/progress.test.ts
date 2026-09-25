import { describe, expect, it } from 'vitest';
import './progress.js';
import type { MbProgress } from './progress.js';

describe('mb-progress', () => {
  it('exposes progressbar ARIA from value/max', async () => {
    const el = document.createElement('mb-progress') as MbProgress;
    el.value = 3;
    el.max = 10;
    el.label = 'Done';
    document.body.appendChild(el);
    await el.updateComplete;

    const bar = el.shadowRoot!.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuenow')).toBe('3');
    expect(bar.getAttribute('aria-valuemax')).toBe('10');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    const fill = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    expect(fill.style.inlineSize).toBe('30%');
    el.remove();
  });

  it('supports percent convenience attribute', async () => {
    const el = document.createElement('mb-progress') as MbProgress;
    el.percent = 50;
    document.body.appendChild(el);
    await el.updateComplete;
    const bar = el.shadowRoot!.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuenow')).toBe('50');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    el.remove();
  });

  it('clamps visual and ARIA values to the valid range', async () => {
    const el = document.createElement('mb-progress') as MbProgress;
    el.value = 150;
    el.max = 100;
    document.body.appendChild(el);
    await el.updateComplete;

    const bar = el.shadowRoot!.querySelector('[role="progressbar"]')!;
    const fill = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(fill.style.inlineSize).toBe('100%');

    el.value = -5;
    await el.updateComplete;
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
    expect(fill.style.inlineSize).toBe('0%');
    el.remove();
  });
});
