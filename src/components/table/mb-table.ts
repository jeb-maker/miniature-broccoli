import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { safeDefine } from '../../lib/safe-define.js';
import { sharedStyles } from '../../lib/styles.js';
import {
  NARROW_MQ,
  compareSortValues,
  sectionsConverter,
} from './helpers.js';
import { tableStyles } from './styles.js';
import type {
  TableDensity,
  TableLayout,
  TableSection,
  TableSortDirection,
} from './types.js';
import type { MbTableCell } from './mb-table-cell.js';
import type { MbTableRow } from './mb-table-row.js';

/**
 * Responsive data table: grid on wide viewports, stacked cards when narrow.
 * Optional `sections` group body rows (`section` on each row). Head cells with
 * `sort-key` are sortable (client reorder + `mb-sort` event). Set `reorderable`
 * for drag-and-drop row reordering (and cross-section moves).
 *
 * ```html
 * <mb-table
 *   reorderable
 *   sections='[{"id":"ops","label":"Ops"},{"id":"eng","label":"Engineering"}]'
 *   columns="2fr 1fr auto"
 * >
 *   <mb-table-row slot="head">
 *     <mb-table-cell sort-key="title">Title</mb-table-cell>
 *     <mb-table-cell sort-key="status">Status</mb-table-cell>
 *     <mb-table-cell></mb-table-cell>
 *   </mb-table-row>
 *   <mb-table-row section="ops">…</mb-table-row>
 * </mb-table>
 * ```
 */
export class MbTable extends LitElement {
  static override styles = [sharedStyles, tableStyles];

  /** Accessible name / visible caption when set. */
  @property()
  label = '';

  /**
   * Column track list for wide layout, e.g. `"2fr 1fr auto"` or `"3"`.
   * A bare integer becomes `repeat(n, minmax(0, 1fr))`.
   */
  @property()
  columns = '';

  @property({ reflect: true })
  density: TableDensity = 'default';

  /**
   * `auto` — cards below 36rem, table above (matches `mb-nav`).
   * `table` / `cards` — force one presentation.
   */
  @property({ reflect: true })
  layout: TableLayout = 'auto';

  /**
   * Section list (JS property or JSON attribute). Body rows reference a section
   * via `section="id"` and are slotted under that group.
   */
  @property({
    attribute: 'sections',
    converter: sectionsConverter,
  })
  sections: TableSection[] = [];

  /** Active sort column key (matches `sort-key` on a head cell). */
  @property({ attribute: 'sort-key', reflect: true })
  sortKey = '';

  /** Active sort direction when `sort-key` is set. */
  @property({ attribute: 'sort-direction', reflect: true })
  sortDirection: TableSortDirection = 'asc';

  /** Enable drag-and-drop reordering via the row handle (pointer / touch). */
  @property({ type: Boolean, reflect: true })
  reorderable = false;

  /** `aria-label` for the reorder handle (SSR / i18n). Default: English. */
  @property({ attribute: 'reorder-label' })
  reorderLabel = 'Drag to reorder';

  /**
   * `aria-label` template for sortable head buttons.
   * `{name}` is replaced with the column `sort-key` or visible head text.
   */
  @property({ attribute: 'sort-label' })
  sortLabel = 'Sort by {name}';

  /**
   * When set, hide auto row counts in section heads (per-section `count: false`
   * also hides). Custom `meta` / slotted meta still render.
   */
  @property({ type: Boolean, reflect: true, attribute: 'hide-count' })
  hideCount = false;

  /** Stick the column header row while scrolling (wide / table mode only). */
  @property({ type: Boolean, reflect: true, attribute: 'sticky-header' })
  stickyHeader = false;

  @state()
  private _sectionCounts: Record<string, number> = {};

  #mq?: MediaQueryList;
  #onMq = () => this.#syncMode();
  #sorting = false;
  #syncing = false;
  #committingReorder = false;
  #dragRow: MbTableRow | null = null;
  #dropRow: MbTableRow | null = null;
  #dropEdge: 'before' | 'after' = 'before';
  #dropSectionId: string | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'table');
    this.#mq = window.matchMedia(NARROW_MQ);
    this.#mq.addEventListener('change', this.#onMq);
    this.#applyColumns();
    queueMicrotask(() => this.#syncMode());
  }

  override disconnectedCallback(): void {
    this.#mq?.removeEventListener('change', this.#onMq);
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    if (this.label) {
      this.setAttribute('aria-label', this.label);
    } else {
      this.removeAttribute('aria-label');
    }
    const needsSync =
      changed.has('columns') ||
      changed.has('layout') ||
      changed.has('density') ||
      changed.has('sections') ||
      changed.has('reorderable') ||
      changed.has('reorderLabel') ||
      changed.has('sortLabel');
    const needsSort =
      changed.has('sortKey') || changed.has('sortDirection') || changed.has('sections');
    if (needsSync || needsSort) {
      queueMicrotask(() => {
        if (needsSync) {
          this.#applyColumns();
          this.#syncMode();
        }
        if (needsSort) {
          this.#syncSortUi();
          this.#applySort();
        }
      });
    }
  }

  get #mode(): 'table' | 'cards' {
    if (this.layout === 'table') return 'table';
    if (this.layout === 'cards') return 'cards';
    return this.#mq?.matches ? 'cards' : 'table';
  }

  get #hasSections(): boolean {
    return this.sections.length > 0;
  }

  #applyColumns(): void {
    const raw = this.columns.trim();
    if (!raw) {
      this.style.removeProperty('--mb-table-template');
      this.style.removeProperty('--mb-table-col-count');
      return;
    }
    if (/^\d+$/.test(raw)) {
      this.style.setProperty('--mb-table-col-count', raw);
      this.style.setProperty(
        '--mb-table-template',
        `repeat(${raw}, minmax(0, 1fr))`,
      );
      return;
    }
    this.style.setProperty('--mb-table-template', raw);
  }

  /** Re-slot rows and refresh presentation (called when a row `section` changes). */
  refreshRows(): void {
    if (this.#committingReorder) return;
    this.#syncMode();
    this.#applySort();
  }

  #bodyRows(): MbTableRow[] {
    return [...this.querySelectorAll('mb-table-row')].filter(
      (row) => row.slot !== 'head' && !row.hasAttribute('head'),
    );
  }

  #headRow(): MbTableRow | null {
    return (
      this.querySelector<MbTableRow>('mb-table-row[slot="head"]') ??
      this.querySelector<MbTableRow>('mb-table-row[head]')
    );
  }

  #syncRowSlots(): void {
    const known = new Set(this.sections.map((section) => section.id));
    const counts: Record<string, number> = {};
    for (const section of this.sections) {
      counts[section.id] = 0;
    }

    for (const row of this.#bodyRows()) {
      const id = row.section.trim();
      if (id && known.has(id)) {
        const slotName = `section-${id}`;
        if (row.slot !== slotName) {
          row.slot = slotName;
        }
        counts[id] = (counts[id] ?? 0) + 1;
      } else if (row.slot.startsWith('section-')) {
        row.slot = '';
      }
    }

    const prev = this._sectionCounts;
    const same =
      Object.keys(counts).length === Object.keys(prev).length &&
      Object.keys(counts).every((key) => prev[key] === counts[key]);
    if (!same) {
      this._sectionCounts = counts;
    }
  }

  #syncMode(): void {
    if (this.#syncing) return;
    this.#syncing = true;
    try {
      const mode = this.#mode;
      this.setAttribute('data-mode', mode);
      this.#syncRowSlots();
      const rows = this.querySelectorAll('mb-table-row');
      rows.forEach((row) => {
        row.setAttribute('data-mode', mode);
        row.toggleAttribute('data-compact', this.density === 'compact');
        const isHead = row.slot === 'head' || row.hasAttribute('head');
        row.toggleAttribute('data-reorderable', this.reorderable && !isHead);
        row.toggleAttribute('data-reorder-spacer', this.reorderable && isHead);
        if (this.reorderable && !isHead) {
          row.setAttribute('data-reorder-label', this.reorderLabel);
        } else {
          row.removeAttribute('data-reorder-label');
        }
        row.requestUpdate();
      });
      const cells = this.querySelectorAll('mb-table-cell');
      cells.forEach((cell) => {
        cell.setAttribute('data-mode', mode);
        cell.toggleAttribute('data-compact', this.density === 'compact');
        if (cell.sortKey.trim() || cell.sortable) {
          cell.setAttribute('data-sort-label', this.sortLabel);
        }
        cell.requestUpdate();
      });
      this.#syncLabelsFromHead();
      this.#syncSortUi();
      this.#syncUngroupedVisibility();
    } finally {
      this.#syncing = false;
    }
  }

  #syncUngroupedVisibility(): void {
    if (!this.#hasSections) return;
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot.ungrouped-slot');
    const host = this.renderRoot.querySelector('.ungrouped');
    if (!slot || !host) return;
    const has = slot.assignedElements({ flatten: true }).some(
      (node) => node.localName === 'mb-table-row',
    );
    host.toggleAttribute('data-has-content', has);
  }

  #syncLabelsFromHead(): void {
    const head = this.#headRow();
    if (!head) return;
    const headCells = [...head.querySelectorAll<MbTableCell>('mb-table-cell')];
    const labels = headCells.map((cell) => {
      if (cell.hideLabel || cell.actions) return '';
      return (cell.textContent ?? '').replace(/\s+/g, ' ').trim();
    });
    if (!headCells.length) return;

    if (!this.columns.trim()) {
      this.style.setProperty('--mb-table-col-count', String(headCells.length));
      this.style.setProperty(
        '--mb-table-template',
        `repeat(${headCells.length}, minmax(0, 1fr))`,
      );
    }

    for (const row of this.#bodyRows()) {
      const cells = [...row.querySelectorAll<MbTableCell>(':scope > mb-table-cell')];
      cells.forEach((cell, index) => {
        if (cell.hideLabel || cell.actions) {
          cell.dataset.labelLocked = 'true';
          if (cell.label) cell.label = '';
          return;
        }
        if (cell.dataset.labelLocked === 'true') return;
        if (cell.hasAttribute('label')) {
          cell.dataset.labelLocked = 'true';
          return;
        }
        const text = labels[index];
        if (text && cell.label !== text) cell.label = text;
      });
    }
  }

  #syncSortUi(): void {
    const head = this.#headRow();
    if (!head) return;
    for (const cell of head.querySelectorAll<MbTableCell>('mb-table-cell')) {
      const key = cell.sortKey.trim();
      const active = Boolean(key) && key === this.sortKey;
      const direction = active ? this.sortDirection : null;
      if (key && !cell.sortable) {
        cell.sortable = true;
      }
      if (cell.sortActive !== active) {
        cell.sortActive = active;
      }
      if (cell.sortDirection !== direction) {
        cell.sortDirection = direction;
      }
    }
  }

  #sortColumnIndex(key: string): number {
    const head = this.#headRow();
    if (!head) return -1;
    return [...head.querySelectorAll<MbTableCell>('mb-table-cell')].findIndex(
      (cell) => cell.sortKey.trim() === key,
    );
  }

  #rowSortValue(row: MbTableRow, key: string): string {
    if (row.sortValue.trim() && (!key || this.#sortColumnIndex(key) < 0)) {
      return row.sortValue.trim();
    }
    const index = this.#sortColumnIndex(key);
    if (index < 0) return row.sortValue.trim();
    const cell = row.querySelectorAll<MbTableCell>(':scope > mb-table-cell')[index];
    if (!cell) return '';
    if (cell.sortValue.trim()) return cell.sortValue.trim();
    const control = cell.querySelector<HTMLElement & { value?: string }>(
      'mb-input, mb-select, mb-textarea, input, select, textarea',
    );
    if (control && typeof control.value === 'string' && control.value !== '') {
      return control.value;
    }
    return (cell.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  #applySort(): void {
    if (this.#sorting || !this.sortKey.trim()) return;
    this.#sorting = true;
    try {
      const key = this.sortKey.trim();
      const dir = this.sortDirection === 'desc' ? -1 : 1;
      const groups = this.#hasSections
        ? this.sections.map((section) =>
            this.#bodyRows().filter((row) => row.section.trim() === section.id),
          )
        : [this.#bodyRows()];

      for (const rows of groups) {
        const sorted = [...rows].sort(
          (a, b) =>
            dir * compareSortValues(this.#rowSortValue(a, key), this.#rowSortValue(b, key)),
        );
        const unchanged =
          rows.length === sorted.length && rows.every((row, index) => row === sorted[index]);
        if (unchanged) continue;
        for (const row of sorted) {
          this.appendChild(row);
        }
      }
    } finally {
      this.#sorting = false;
    }
  }

  #cycleSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.#syncSortUi();
    this.#applySort();
    this.dispatchEvent(
      new CustomEvent('mb-sort', {
        detail: { key: this.sortKey, direction: this.sortDirection },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Begin pointer-driven reorder from a row handle. */
  beginReorder(row: MbTableRow, event: PointerEvent): void {
    if (!this.reorderable || row.head || row.slot === 'head' || this.#dragRow) return;
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    this.#dragRow = row;
    row.toggleAttribute('data-dragging', true);
    window.addEventListener('pointermove', this.#onReorderMove);
    window.addEventListener('pointerup', this.#onReorderEnd);
    window.addEventListener('pointercancel', this.#onReorderEnd);
  }

  #clearDropUi(): void {
    this.querySelectorAll('mb-table-row[data-drop]').forEach((row) => {
      row.removeAttribute('data-drop');
    });
    this.renderRoot.querySelectorAll('[data-drop-section]').forEach((node) => {
      node.removeAttribute('data-drop-section');
    });
    this.#dropRow = null;
    this.#dropSectionId = null;
  }

  #onReorderMove = (event: PointerEvent): void => {
    if (!this.#dragRow) return;
    const stack = document.elementsFromPoint(event.clientX, event.clientY);
    const overRow = stack.find(
      (node): node is MbTableRow =>
        node instanceof HTMLElement &&
        node.localName === 'mb-table-row' &&
        this.contains(node) &&
        node !== this.#dragRow &&
        node.slot !== 'head' &&
        !node.hasAttribute('head'),
    );
    const sectionHost = stack.find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        this.renderRoot.contains(node) &&
        node.hasAttribute('data-section'),
    );

    this.#clearDropUi();

    if (overRow) {
      const rect = overRow.getBoundingClientRect();
      const edge = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
      this.#dropRow = overRow;
      this.#dropEdge = edge;
      this.#dropSectionId = overRow.section.trim() || null;
      overRow.setAttribute('data-drop', edge);
      return;
    }

    if (sectionHost) {
      const id = sectionHost.getAttribute('data-section');
      if (id) {
        this.#dropSectionId = id;
        sectionHost.toggleAttribute('data-drop-section', true);
      }
    }
  };

  #onReorderEnd = (): void => {
    const dragRow = this.#dragRow;
    const dropRow = this.#dropRow;
    const dropEdge = this.#dropEdge;
    const dropSectionId = this.#dropSectionId;

    window.removeEventListener('pointermove', this.#onReorderMove);
    window.removeEventListener('pointerup', this.#onReorderEnd);
    window.removeEventListener('pointercancel', this.#onReorderEnd);

    dragRow?.removeAttribute('data-dragging');
    this.#clearDropUi();
    this.#dragRow = null;

    if (!dragRow) return;

    if (dropRow) {
      this.moveRow(dragRow, {
        before: dropEdge === 'before' ? dropRow : undefined,
        after: dropEdge === 'after' ? dropRow : undefined,
        section: dropRow.section.trim() || undefined,
      });
      return;
    }

    if (dropSectionId != null) {
      this.moveRow(dragRow, { section: dropSectionId });
    }
  };

  /**
   * Move a body row before/after another row and/or into a section.
   * Same outcome as a successful drag-and-drop; emits `mb-reorder`.
   */
  moveRow(
    row: MbTableRow,
    target: { before?: MbTableRow; after?: MbTableRow; section?: string } = {},
  ): void {
    if (row.head || row.slot === 'head') return;
    if (!this.contains(row)) return;
    if (target.before && !this.contains(target.before)) return;
    if (target.after && !this.contains(target.after)) return;

    const fromSection = row.section.trim();
    let toSection = target.section ?? fromSection;
    let moved = false;

    this.#committingReorder = true;
    if (this.sortKey) {
      this.sortKey = '';
      this.#syncSortUi();
    }

    try {
      if (target.section != null && target.section !== fromSection) {
        row.section = target.section;
        toSection = target.section;
        moved = true;
      }

      if (target.before && target.before !== row) {
        if (target.before.previousElementSibling !== row) {
          target.before.before(row);
          moved = true;
        }
        toSection = target.before.section.trim() || toSection;
        if (row.section.trim() !== toSection) {
          row.section = toSection;
          moved = true;
        }
      } else if (target.after && target.after !== row) {
        if (target.after.nextElementSibling !== row) {
          target.after.after(row);
          moved = true;
        }
        toSection = target.after.section.trim() || toSection;
        if (row.section.trim() !== toSection) {
          row.section = toSection;
          moved = true;
        }
      } else if (target.section != null) {
        const sectionRows = this.#bodyRows().filter(
          (item) => item !== row && item.section.trim() === target.section,
        );
        const last = sectionRows[sectionRows.length - 1];
        if (last) {
          last.after(row);
          moved = true;
        } else {
          this.appendChild(row);
          moved = true;
        }
      }
    } finally {
      this.#committingReorder = false;
    }

    if (!moved) return;

    this.#syncMode();

    const order = this.#bodyRows().map((item) => ({
      id: item.id || item.getAttribute('data-id') || '',
      section: item.section.trim(),
    }));

    this.dispatchEvent(
      new CustomEvent('mb-reorder', {
        detail: {
          rowId: row.id || row.getAttribute('data-id') || '',
          fromSection,
          toSection,
          beforeId: target.before
            ? target.before.id || target.before.getAttribute('data-id') || ''
            : null,
          afterId: target.after
            ? target.after.id || target.after.getAttribute('data-id') || ''
            : null,
          order,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Move a body row one position with the keyboard. */
  moveRowByKeyboard(row: MbTableRow, direction: -1 | 1): void {
    if (!this.reorderable || !this.contains(row)) return;
    const rows = this.#bodyRows();
    const index = rows.indexOf(row);
    const target = rows[index + direction];
    if (index < 0 || !target) return;
    if (direction < 0) {
      this.moveRow(row, { before: target, section: target.section || undefined });
    } else {
      this.moveRow(row, { after: target, section: target.section || undefined });
    }
  }

  #toggleSection(id: string): void {
    const index = this.sections.findIndex((section) => section.id === id);
    if (index < 0) return;
    const next = this.sections.map((section, i) =>
      i === index ? { ...section, collapsed: !section.collapsed } : section,
    );
    this.sections = next;
    const collapsed = Boolean(next[index]?.collapsed);
    this.dispatchEvent(
      new CustomEvent('mb-section-toggle', {
        detail: { id, collapsed },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onSlotChange = (): void => {
    if (this.#sorting || this.#syncing) return;
    queueMicrotask(() => {
      if (this.#sorting || this.#syncing) return;
      this.#syncMode();
      this.#applySort();
    });
  };

  #onEmptySlot(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const has = slot.assignedNodes({ flatten: true }).length > 0;
    this.renderRoot.querySelector('.empty')?.toggleAttribute('data-has-content', has);
  }

  #showSectionCount(section: TableSection): boolean {
    if (this.hideCount) return false;
    if (section.count === false) return false;
    return true;
  }

  #onHeadClick = (event: Event): void => {
    const path = event.composedPath();
    const cell = path.find(
      (node): node is MbTableCell =>
        node instanceof HTMLElement && node.localName === 'mb-table-cell',
    );
    if (!cell?.sortKey.trim()) return;
    if (event.defaultPrevented) return;
    const blocked = path.some(
      (node) =>
        node instanceof Element &&
        node.matches(
          'mb-input, mb-select, mb-textarea, mb-button, a, input, select, textarea',
        ),
    );
    if (blocked) return;
    this.#cycleSort(cell.sortKey.trim());
  };

  override render() {
    return html`
      <div part="root" class="root">
        ${this.label
          ? html`<div part="caption" class="caption">${this.label}</div>`
          : nothing}
        <div part="frame" class="frame">
          <div part="head" class="head" @click=${this.#onHeadClick}>
            <slot name="head" @slotchange=${this.#onSlotChange}></slot>
          </div>
          <div part="body" class="body">
            ${this.#hasSections
              ? html`
                  ${repeat(
                    this.sections,
                    (section) => section.id,
                    (section) => html`
                      <section
                        part="section"
                        class="section"
                        data-section=${section.id}
                        ?data-collapsed=${Boolean(section.collapsed)}
                      >
                        <button
                          type="button"
                          part="section-head"
                          class="section-head"
                          aria-expanded=${section.collapsed ? 'false' : 'true'}
                          @click=${() => this.#toggleSection(section.id)}
                        >
                          <span class="section-label">${section.label}</span>
                          <span class="section-meta">
                            ${section.meta
                              ? html`<span part="section-custom-meta">${section.meta}</span>`
                              : nothing}
                            <slot name=${`section-meta-${section.id}`}></slot>
                            ${this.#showSectionCount(section)
                              ? html`<span part="section-count"
                                  >${this._sectionCounts[section.id] ?? 0}</span
                                >`
                              : nothing}
                            <span class="section-chevron" aria-hidden="true">▾</span>
                          </span>
                        </button>
                        <div part="section-rows" class="section-rows">
                          <slot
                            name=${`section-${section.id}`}
                            @slotchange=${this.#onSlotChange}
                          ></slot>
                        </div>
                      </section>
                    `,
                  )}
                  <div part="ungrouped" class="ungrouped section">
                    <slot
                      class="ungrouped-slot"
                      @slotchange=${this.#onSlotChange}
                    ></slot>
                  </div>
                `
              : html`<slot @slotchange=${this.#onSlotChange}></slot>`}
          </div>
        </div>
        <div part="empty" class="empty">
          <slot name="empty" @slotchange=${this.#onEmptySlot}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-table': MbTable;
  }
}

safeDefine('mb-table', MbTable);
