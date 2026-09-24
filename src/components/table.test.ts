import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import './table.js';
import type { MbTable, MbTableCell } from './table.js';

describe('mb-table', () => {
  let widthMatcher = false;
  let listener: ((event: MediaQueryListEvent) => void) | undefined;

  beforeEach(() => {
    widthMatcher = false;
    listener = undefined;
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      const mql = {
        get matches() {
          return query.includes('max-width') ? widthMatcher : false;
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_: string, cb: (event: MediaQueryListEvent) => void) => {
          listener = cb;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
      return mql as unknown as MediaQueryList;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  async function mountEditable(): Promise<MbTable> {
    const el = document.createElement('mb-table') as MbTable;
    el.label = 'People';
    el.density = 'compact';
    el.innerHTML = `
      <mb-table-row slot="head">
        <mb-table-cell>Name</mb-table-cell>
        <mb-table-cell>Status</mb-table-cell>
        <mb-table-cell></mb-table-cell>
      </mb-table-row>
      <mb-table-row>
        <mb-table-cell primary>
          <span>Ada</span>
        </mb-table-cell>
        <mb-table-cell>
          <span>Active</span>
        </mb-table-cell>
        <mb-table-cell align="end">
          <button type="button">Save</button>
        </mb-table-cell>
      </mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    // slotchange sync is sync after upgrade
    await el.updateComplete;
    return el;
  }

  it('registers table / row / cell and exposes table semantics', async () => {
    const el = await mountEditable();
    expect(el.getAttribute('role')).toBe('table');
    expect(el.getAttribute('aria-label')).toBe('People');
    expect(el.getAttribute('data-mode')).toBe('table');
    expect(el.querySelector('mb-table-row')?.getAttribute('role')).toBe('row');
    el.remove();
  });

  it('copies head labels onto body cells for card layout', async () => {
    const el = await mountEditable();
    const cells = [
      ...el.querySelectorAll<MbTableCell>('mb-table-row:not([slot="head"]) > mb-table-cell'),
    ];
    expect(cells[0].label).toBe('Name');
    expect(cells[1].label).toBe('Status');
    expect(cells[2].label).toBe('');
    el.remove();
  });

  it('switches to cards below the narrow breakpoint', async () => {
    widthMatcher = true;
    const el = await mountEditable();
    expect(el.getAttribute('data-mode')).toBe('cards');
    const bodyRow = el.querySelector('mb-table-row:not([slot="head"])')!;
    expect(bodyRow.getAttribute('data-mode')).toBe('cards');
    const head = el.querySelector('mb-table-row[slot="head"]')!;
    expect(head.hasAttribute('aria-hidden')).toBe(true);
    el.remove();
  });

  it('honors layout="cards" regardless of viewport', async () => {
    const el = await mountEditable();
    el.layout = 'cards';
    await el.updateComplete;
    expect(el.getAttribute('data-mode')).toBe('cards');
    el.remove();
  });

  it('does not overwrite explicit cell labels', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.innerHTML = `
      <mb-table-row slot="head">
        <mb-table-cell>Name</mb-table-cell>
      </mb-table-row>
      <mb-table-row>
        <mb-table-cell label="Full name"><span>Ada</span></mb-table-cell>
      </mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;
    const cell = el.querySelector<MbTableCell>('mb-table-row:not([slot="head"]) mb-table-cell')!;
    expect(cell.label).toBe('Full name');
    el.remove();
  });

  it('applies numeric columns as equal tracks', async () => {
    const el = await mountEditable();
    el.columns = '3';
    await el.updateComplete;
    expect(el.style.getPropertyValue('--mb-table-col-count')).toBe('3');
    expect(el.style.getPropertyValue('--mb-table-template')).toContain('repeat(3');
    el.remove();
  });

  it('reacts to viewport changes while layout=auto', async () => {
    const el = await mountEditable();
    expect(el.getAttribute('data-mode')).toBe('table');
    widthMatcher = true;
    listener?.({ matches: true } as MediaQueryListEvent);
    await el.updateComplete;
    expect(el.getAttribute('data-mode')).toBe('cards');
    el.remove();
  });
});
