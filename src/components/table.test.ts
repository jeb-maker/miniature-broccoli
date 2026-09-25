import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import './table.js';
import type { MbTable, MbTableCell, MbTableRow } from './table.js';

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
    await Promise.resolve();
    const head = el.querySelector<MbTableRow>('mb-table-row[slot="head"]')!;
    const bodyCell = el.querySelector<MbTableCell>(
      'mb-table-row:not([slot="head"]) mb-table-cell',
    )!;
    await head.updateComplete;
    await bodyCell.updateComplete;
    expect(el.getAttribute('data-mode')).toBe('cards');
    expect(head.getAttribute('aria-hidden')).toBe('true');
    expect(bodyCell.shadowRoot!.querySelector('.label')!.hasAttribute('hidden')).toBe(false);
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

  it('groups rows into section slots from sections + row.section', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.sections = [
      { id: 'ops', label: 'Ops' },
      { id: 'eng', label: 'Engineering' },
    ];
    el.innerHTML = `
      <mb-table-row slot="head">
        <mb-table-cell sort-key="name">Name</mb-table-cell>
      </mb-table-row>
      <mb-table-row section="eng"><mb-table-cell sort-value="Zoe">Zoe</mb-table-cell></mb-table-row>
      <mb-table-row section="ops"><mb-table-cell sort-value="Ada">Ada</mb-table-cell></mb-table-row>
      <mb-table-row section="ops"><mb-table-cell sort-value="Lin">Lin</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;

    const opsRows = [...el.querySelectorAll<MbTableRow>('mb-table-row[section="ops"]')];
    const engRows = [...el.querySelectorAll<MbTableRow>('mb-table-row[section="eng"]')];
    expect(opsRows.every((row) => row.slot === 'section-ops')).toBe(true);
    expect(engRows.every((row) => row.slot === 'section-eng')).toBe(true);
    expect(el.shadowRoot!.textContent).toContain('Ops');
    expect(el.shadowRoot!.textContent).toContain('Engineering');
    el.remove();
  });

  it('sorts rows within each section and emits mb-sort', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.sections = [
      { id: 'ops', label: 'Ops' },
      { id: 'eng', label: 'Engineering' },
    ];
    el.innerHTML = `
      <mb-table-row slot="head">
        <mb-table-cell sort-key="name">Name</mb-table-cell>
      </mb-table-row>
      <mb-table-row section="ops"><mb-table-cell sort-value="Lin">Lin</mb-table-cell></mb-table-row>
      <mb-table-row section="ops"><mb-table-cell sort-value="Ada">Ada</mb-table-cell></mb-table-row>
      <mb-table-row section="eng"><mb-table-cell sort-value="Zoe">Zoe</mb-table-cell></mb-table-row>
      <mb-table-row section="eng"><mb-table-cell sort-value="Bea">Bea</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;

    const sorts: Array<{ key: string; direction: string }> = [];
    el.addEventListener('mb-sort', ((event: CustomEvent) => {
      sorts.push(event.detail);
    }) as EventListener);

    const headCell = el.querySelector<MbTableCell>('mb-table-row[slot="head"] mb-table-cell')!;
    await headCell.updateComplete;
    const sortBtn = headCell.shadowRoot!.querySelector('button.sort') as HTMLButtonElement;
    sortBtn.click();
    await el.updateComplete;

    expect(el.sortKey).toBe('name');
    expect(el.sortDirection).toBe('asc');
    expect(sorts).toEqual([{ key: 'name', direction: 'asc' }]);

    const opsOrder = [...el.querySelectorAll<MbTableRow>('mb-table-row[section="ops"]')].map(
      (row) => row.querySelector('mb-table-cell')!.sortValue || row.textContent?.trim(),
    );
    const engOrder = [...el.querySelectorAll<MbTableRow>('mb-table-row[section="eng"]')].map(
      (row) => row.querySelector('mb-table-cell')!.sortValue || row.textContent?.trim(),
    );
    expect(opsOrder).toEqual(['Ada', 'Lin']);
    expect(engOrder).toEqual(['Bea', 'Zoe']);

    sortBtn.click();
    await el.updateComplete;
    expect(el.sortDirection).toBe('desc');
    const opsDesc = [...el.querySelectorAll<MbTableRow>('mb-table-row[section="ops"]')].map(
      (row) => row.querySelector('mb-table-cell')!.sortValue,
    );
    expect(opsDesc).toEqual(['Lin', 'Ada']);
    el.remove();
  });

  it('toggles section collapsed and emits mb-section-toggle', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.sections = [{ id: 'ops', label: 'Ops' }];
    el.innerHTML = `
      <mb-table-row slot="head"><mb-table-cell>Name</mb-table-cell></mb-table-row>
      <mb-table-row section="ops"><mb-table-cell>Ada</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;

    const toggles: Array<{ id: string; collapsed: boolean }> = [];
    el.addEventListener('mb-section-toggle', ((event: CustomEvent) => {
      toggles.push(event.detail);
    }) as EventListener);

    const button = el.shadowRoot!.querySelector('.section-head') as HTMLButtonElement;
    button.click();
    await el.updateComplete;

    expect(el.sections[0].collapsed).toBe(true);
    expect(toggles).toEqual([{ id: 'ops', collapsed: true }]);
    expect(el.shadowRoot!.querySelector('.section')?.hasAttribute('data-collapsed')).toBe(true);
    el.remove();
  });

  it('parses sections JSON attribute', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.setAttribute(
      'sections',
      JSON.stringify([
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', collapsed: true },
      ]),
    );
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.sections).toEqual([
      { id: 'a', label: 'A', collapsed: false },
      { id: 'b', label: 'B', collapsed: true },
    ]);
    el.remove();
  });

  it('reorders rows via moveRow and emits mb-reorder', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.reorderable = true;
    el.innerHTML = `
      <mb-table-row slot="head"><mb-table-cell>Name</mb-table-cell></mb-table-row>
      <mb-table-row id="a"><mb-table-cell>Ada</mb-table-cell></mb-table-row>
      <mb-table-row id="b"><mb-table-cell>Bea</mb-table-cell></mb-table-row>
      <mb-table-row id="c"><mb-table-cell>Cyd</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;

    const bodyRows = () =>
      [...el.querySelectorAll<MbTableRow>('mb-table-row')].filter((row) => row.slot !== 'head');
    expect(bodyRows().map((row) => row.id)).toEqual(['a', 'b', 'c']);

    const rowA = el.querySelector<MbTableRow>('#a')!;
    await rowA.updateComplete;
    expect(rowA.hasAttribute('data-reorderable')).toBe(true);
    expect(rowA.shadowRoot!.querySelector('.handle')).toBeTruthy();

    const events: Array<{ rowId: string; order: Array<{ id: string }> }> = [];
    el.addEventListener('mb-reorder', ((event: CustomEvent) => {
      events.push(event.detail);
    }) as EventListener);

    el.moveRow(rowA, { after: el.querySelector<MbTableRow>('#c')! });
    await el.updateComplete;

    expect(bodyRows().map((row) => row.id)).toEqual(['b', 'c', 'a']);
    expect(events.length).toBe(1);
    expect(events[0].rowId).toBe('a');
    expect(events[0].order.map((item) => item.id)).toEqual(['b', 'c', 'a']);
    el.remove();
  });

  it('rejects cross-table targets', async () => {
    const first = document.createElement('mb-table') as MbTable;
    const second = document.createElement('mb-table') as MbTable;
    first.reorderable = true;
    second.reorderable = true;
    first.innerHTML = '<mb-table-row id="first"><mb-table-cell>A</mb-table-cell></mb-table-row>';
    second.innerHTML = '<mb-table-row id="second"><mb-table-cell>B</mb-table-cell></mb-table-row>';
    document.body.append(first, second);
    await first.updateComplete;
    await second.updateComplete;

    const source = first.querySelector<MbTableRow>('#first')!;
    const foreign = second.querySelector<MbTableRow>('#second')!;
    first.moveRow(source, { before: foreign });

    expect(source.parentElement).toBe(first);
  });

  it('moves a row to another section on drop', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.reorderable = true;
    el.sections = [
      { id: 'ops', label: 'Ops' },
      { id: 'eng', label: 'Engineering' },
    ];
    el.innerHTML = `
      <mb-table-row slot="head"><mb-table-cell>Name</mb-table-cell></mb-table-row>
      <mb-table-row id="a" section="ops"><mb-table-cell>Ada</mb-table-cell></mb-table-row>
      <mb-table-row id="b" section="eng"><mb-table-cell>Bea</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;

    const rowA = el.querySelector<MbTableRow>('#a')!;
    el.moveRow(rowA, { before: el.querySelector<MbTableRow>('#b')!, section: 'eng' });
    await el.updateComplete;
    await el.updateComplete;

    expect(rowA.section).toBe('eng');
    expect(rowA.slot).toBe('section-eng');
    el.remove();
  });

  it('exposes a drag handle when reorderable', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.reorderable = true;
    el.innerHTML = `
      <mb-table-row slot="head"><mb-table-cell>Name</mb-table-cell></mb-table-row>
      <mb-table-row id="a"><mb-table-cell>Ada</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;
    const row = el.querySelector<MbTableRow>('#a')!;
    await row.updateComplete;
    const handle = row.shadowRoot!.querySelector('.handle') as HTMLButtonElement;
    expect(handle.getAttribute('aria-label')).toBe('Drag to reorder');
    el.beginReorder(
      row,
      new PointerEvent('pointerdown', { pointerId: 9, button: 0, clientX: 1, clientY: 1 }),
    );
    expect(row.hasAttribute('data-dragging')).toBe(true);
    window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 9 }));
    expect(row.hasAttribute('data-dragging')).toBe(false);
    el.remove();
  });

  it('adds handles dynamically and supports keyboard reordering', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.innerHTML = `
      <mb-table-row id="a"><mb-table-cell>Ada</mb-table-cell></mb-table-row>
      <mb-table-row id="b"><mb-table-cell>Bea</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    const rowA = el.querySelector<MbTableRow>('#a')!;
    expect(rowA.shadowRoot!.querySelector('.handle')).toBeNull();

    el.reorderable = true;
    await el.updateComplete;
    await Promise.resolve();
    await rowA.updateComplete;
    const handle = rowA.shadowRoot!.querySelector('.handle') as HTMLButtonElement;
    expect(handle).toBeTruthy();

    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect([...el.querySelectorAll<MbTableRow>('mb-table-row')].map((row) => row.id)).toEqual([
      'b',
      'a',
    ]);
    el.remove();
  });

  it('applies reorder-label and sort-label attributes for a11y (#41)', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.reorderable = true;
    el.reorderLabel = 'Réordonner';
    el.sortLabel = 'Trier par {name}';
    el.innerHTML = `
      <mb-table-row slot="head">
        <mb-table-cell sort-key="title">Titre</mb-table-cell>
      </mb-table-row>
      <mb-table-row id="a"><mb-table-cell>Ada</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;

    const row = el.querySelector<MbTableRow>('#a')!;
    await row.updateComplete;
    expect(row.shadowRoot!.querySelector('.handle')!.getAttribute('aria-label')).toBe(
      'Réordonner',
    );

    const headCell = el.querySelector<MbTableCell>('mb-table-row[slot="head"] mb-table-cell')!;
    await headCell.updateComplete;
    expect(headCell.shadowRoot!.querySelector('button.sort')!.getAttribute('aria-label')).toBe(
      'Trier par title',
    );
    el.remove();
  });

  it('skips cards labels for hide-label / actions cells (#42)', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.layout = 'cards';
    el.innerHTML = `
      <mb-table-row slot="head">
        <mb-table-cell>Title</mb-table-cell>
        <mb-table-cell hide-label>Required</mb-table-cell>
        <mb-table-cell></mb-table-cell>
      </mb-table-row>
      <mb-table-row>
        <mb-table-cell primary><span>Ada</span></mb-table-cell>
        <mb-table-cell hide-label><span>✓</span></mb-table-cell>
        <mb-table-cell actions><button type="button">Save</button></mb-table-cell>
      </mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;

    const cells = [
      ...el.querySelectorAll<MbTableCell>('mb-table-row:not([slot="head"]) > mb-table-cell'),
    ];
    expect(cells[0].label).toBe('Title');
    expect(cells[1].label).toBe('');
    expect(cells[2].label).toBe('');

    await cells[0].updateComplete;
    await cells[1].updateComplete;
    await cells[2].updateComplete;

    expect(cells[0].shadowRoot!.querySelector('.label')!.hasAttribute('hidden')).toBe(false);
    expect(cells[1].shadowRoot!.querySelector('.label')!.hasAttribute('hidden')).toBe(true);
    expect(cells[2].shadowRoot!.querySelector('.label')!.hasAttribute('hidden')).toBe(true);
    el.remove();
  });

  it('renders section meta and can hide the auto count (#40)', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.sections = [
      { id: 'ops', label: 'Ops', meta: '8 / 12 OK', count: false },
      { id: 'eng', label: 'Engineering', meta: '12 points · terminé' },
    ];
    el.innerHTML = `
      <mb-table-row slot="head"><mb-table-cell>Name</mb-table-cell></mb-table-row>
      <mb-table-row section="ops"><mb-table-cell>Ada</mb-table-cell></mb-table-row>
      <mb-table-row section="ops"><mb-table-cell>Lin</mb-table-cell></mb-table-row>
      <mb-table-row section="eng"><mb-table-cell>Bea</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    await el.updateComplete;

    const heads = [...el.shadowRoot!.querySelectorAll('.section-head')];
    expect(heads[0].textContent).toContain('8 / 12 OK');
    expect(heads[0].querySelector('[part="section-count"]')).toBeNull();
    expect(heads[1].textContent).toContain('12 points · terminé');
    expect(heads[1].querySelector('[part="section-count"]')?.textContent).toBe('1');

    el.hideCount = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('[part="section-count"]').length).toBe(0);
    el.remove();
  });

  it('applies sticky-header styles only in table mode (#44)', async () => {
    const el = document.createElement('mb-table') as MbTable;
    el.stickyHeader = true;
    el.layout = 'table';
    el.innerHTML = `
      <mb-table-row slot="head"><mb-table-cell>Name</mb-table-cell></mb-table-row>
      <mb-table-row><mb-table-cell>Ada</mb-table-cell></mb-table-row>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.hasAttribute('sticky-header')).toBe(true);
    expect(el.getAttribute('data-mode')).toBe('table');
    el.layout = 'cards';
    await el.updateComplete;
    expect(el.getAttribute('data-mode')).toBe('cards');
    el.remove();
  });
});
