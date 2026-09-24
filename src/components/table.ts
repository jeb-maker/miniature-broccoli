import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type TableLayout = 'auto' | 'table' | 'cards';
export type TableDensity = 'default' | 'compact';
export type TableCellAlign = 'start' | 'center' | 'end';

const NARROW_MQ = '(max-width: 36rem)';

/**
 * Responsive data table: grid on wide viewports, stacked cards when narrow.
 * Pair cells with `mb-input` / `mb-select` (`density="compact"` + `hide-label`) for editable rows.
 *
 * ```html
 * <mb-table label="Items" columns="2fr 1fr auto" density="compact">
 *   <mb-table-row slot="head">
 *     <mb-table-cell>Name</mb-table-cell>
 *     <mb-table-cell>Status</mb-table-cell>
 *     <mb-table-cell></mb-table-cell>
 *   </mb-table-row>
 *   <mb-table-row>
 *     <mb-table-cell label="Name">…</mb-table-cell>
 *     …
 *   </mb-table-row>
 * </mb-table>
 * ```
 */
export class MbTable extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        inline-size: 100%;
        --mb-table-template: repeat(var(--mb-table-col-count, 1), minmax(0, 1fr));
      }

      .root {
        display: flex;
        flex-direction: column;
        gap: var(--mb-space-3);
      }

      .caption {
        margin: 0;
        font-family: var(--mb-font-display);
        font-size: var(--mb-font-size-lg);
        font-weight: 650;
        line-height: var(--mb-line-height-tight);
      }

      .frame {
        display: flex;
        flex-direction: column;
        gap: var(--mb-space-3);
        min-inline-size: 0;
      }

      .head {
        display: none;
      }

      .body {
        display: flex;
        flex-direction: column;
        gap: var(--mb-space-3);
        min-inline-size: 0;
      }

      .empty:not([data-has-content]) {
        display: none;
      }

      :host([data-mode='table']) .frame {
        gap: 0;
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-lg);
        background: var(--mb-color-surface);
        overflow: clip;
      }

      :host([data-mode='table']) .head {
        display: block;
        background: var(--mb-color-bg);
        border-block-end: 1px solid var(--mb-color-border);
      }

      :host([data-mode='table']) .body {
        gap: 0;
      }

      :host([data-mode='table'][density='compact']) .root {
        gap: var(--mb-space-2);
      }
    `,
  ];

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

  #mq?: MediaQueryList;
  #onMq = () => this.#syncMode();

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'table');
    this.#mq = window.matchMedia(NARROW_MQ);
    this.#mq.addEventListener('change', this.#onMq);
    this.#applyColumns();
    this.#syncMode();
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
    if (changed.has('columns') || changed.has('layout') || changed.has('density')) {
      this.#applyColumns();
      this.#syncMode();
    }
  }

  get #mode(): 'table' | 'cards' {
    if (this.layout === 'table') return 'table';
    if (this.layout === 'cards') return 'cards';
    return this.#mq?.matches ? 'cards' : 'table';
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

  #syncMode(): void {
    const mode = this.#mode;
    this.setAttribute('data-mode', mode);
    const rows = this.querySelectorAll('mb-table-row');
    rows.forEach((row) => {
      row.setAttribute('data-mode', mode);
      row.toggleAttribute('data-compact', this.density === 'compact');
    });
    const cells = this.querySelectorAll('mb-table-cell');
    cells.forEach((cell) => {
      cell.setAttribute('data-mode', mode);
      cell.toggleAttribute('data-compact', this.density === 'compact');
    });
    this.#syncLabelsFromHead();
  }

  #syncLabelsFromHead(): void {
    const head =
      this.querySelector<MbTableRow>('mb-table-row[slot="head"]') ??
      this.querySelector<MbTableRow>('mb-table-row[head]');
    if (!head) return;
    const labels = [...head.querySelectorAll('mb-table-cell')].map((cell) =>
      (cell.textContent ?? '').replace(/\s+/g, ' ').trim(),
    );
    if (!labels.length) return;

    if (!this.columns.trim()) {
      this.style.setProperty('--mb-table-col-count', String(labels.length));
      this.style.setProperty(
        '--mb-table-template',
        `repeat(${labels.length}, minmax(0, 1fr))`,
      );
    }

    const bodyRows = [...this.querySelectorAll('mb-table-row')].filter(
      (row) => row.slot !== 'head' && !row.hasAttribute('head'),
    );
    for (const row of bodyRows) {
      const cells = [...row.querySelectorAll<MbTableCell>(':scope > mb-table-cell')];
      cells.forEach((cell, index) => {
        if (cell.dataset.labelLocked === 'true') return;
        if (cell.hasAttribute('label')) {
          cell.dataset.labelLocked = 'true';
          return;
        }
        const text = labels[index];
        if (text) cell.label = text;
      });
    }
  }

  #onSlotChange = (): void => {
    this.#syncMode();
  };

  #onEmptySlot(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    const has = slot.assignedNodes({ flatten: true }).length > 0;
    this.renderRoot.querySelector('.empty')?.toggleAttribute('data-has-content', has);
  }

  override render() {
    return html`
      <div part="root" class="root">
        ${this.label
          ? html`<div part="caption" class="caption">${this.label}</div>`
          : nothing}
        <div part="frame" class="frame">
          <div part="head" class="head">
            <slot name="head" @slotchange=${this.#onSlotChange}></slot>
          </div>
          <div part="body" class="body">
            <slot @slotchange=${this.#onSlotChange}></slot>
          </div>
        </div>
        <div part="empty" class="empty">
          <slot name="empty" @slotchange=${this.#onEmptySlot}></slot>
        </div>
      </div>
    `;
  }
}

export class MbTableRow extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        min-inline-size: 0;
      }

      .row {
        display: grid;
        grid-template-columns: var(--mb-table-template);
        align-items: center;
        gap: var(--mb-space-3);
        min-inline-size: 0;
      }

      :host([data-mode='table']) .row {
        padding-block: var(--mb-space-3);
        padding-inline: var(--mb-space-4);
        border-block-end: 1px solid var(--mb-color-border);
        background: var(--mb-color-surface);
      }

      :host([data-mode='table'][data-compact]) .row {
        padding-block: var(--mb-space-2);
        padding-inline: var(--mb-space-3);
        gap: var(--mb-space-2);
      }

      :host([data-mode='table']:last-of-type) .row,
      :host([data-mode='table'][slot='head']) .row {
        border-block-end: none;
      }

      :host([slot='head']) .row,
      :host([head]) .row {
        font-size: var(--mb-font-size-sm);
        font-weight: 650;
        color: var(--mb-color-muted);
        background: transparent;
        padding-block: var(--mb-space-2);
      }

      :host([data-mode='cards']) .row {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: var(--mb-space-3);
        padding-block: var(--mb-space-4);
        padding-inline: var(--mb-space-4);
        background: var(--mb-color-surface);
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-lg);
      }

      :host([data-mode='cards'][data-compact]) .row {
        gap: var(--mb-space-2);
        padding-block: var(--mb-space-3);
        padding-inline: var(--mb-space-3);
      }

      :host([data-mode='cards'][slot='head']),
      :host([data-mode='cards'][head]) {
        display: none;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true })
  head = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'row');
    if (this.head && this.slot !== 'head') {
      this.slot = 'head';
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('head') && this.head) {
      this.slot = 'head';
    }
    const isHead = this.slot === 'head' || this.head;
    const hideHead = isHead && this.getAttribute('data-mode') === 'cards';
    this.toggleAttribute('aria-hidden', hideHead);
  }

  override render() {
    return html`
      <div part="row" class="row">
        <slot></slot>
      </div>
    `;
  }
}

export class MbTableCell extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        min-inline-size: 0;
      }

      .cell {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: var(--mb-space-1);
        min-inline-size: 0;
      }

      .label {
        display: none;
        font-size: var(--mb-font-size-sm);
        font-weight: 600;
        color: var(--mb-color-muted);
      }

      .value {
        min-inline-size: 0;
        max-inline-size: 100%;
      }

      :host([align='center']) .cell {
        align-items: center;
        text-align: center;
      }

      :host([align='end']) .cell {
        align-items: end;
        text-align: end;
      }

      :host([data-mode='cards']) .label:not([hidden]) {
        display: block;
      }

      :host([data-mode='cards'][primary]) .value {
        font-family: var(--mb-font-display);
        font-weight: 650;
        font-size: var(--mb-font-size-md);
      }

      :host([data-mode='cards'][align='end']) .cell,
      :host([data-mode='cards'][align='center']) .cell {
        align-items: stretch;
        text-align: start;
      }

      :host([data-mode='cards'][align='end']) .value {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: var(--mb-space-2);
      }
    `,
  ];

  /** Visible field label in card layout (auto-filled from head when empty). */
  @property()
  label = '';

  @property({ reflect: true })
  align: TableCellAlign = 'start';

  /** Emphasize this cell as the card title on narrow viewports. */
  @property({ type: Boolean, reflect: true })
  primary = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#syncRole();
  }

  override updated(): void {
    this.#syncRole();
  }

  #isHead(): boolean {
    const row = this.parentElement;
    return row?.slot === 'head' || row?.hasAttribute('head') === true;
  }

  #syncRole(): void {
    this.setAttribute('role', this.#isHead() ? 'columnheader' : 'cell');
  }

  override render() {
    const showLabel =
      Boolean(this.label) && this.getAttribute('data-mode') === 'cards' && !this.#isHead();

    return html`
      <div part="cell" class="cell">
        <span part="label" class="label" ?hidden=${!showLabel}>${this.label}</span>
        <div part="value" class="value">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-table': MbTable;
    'mb-table-row': MbTableRow;
    'mb-table-cell': MbTableCell;
  }
}

safeDefine('mb-table', MbTable);
safeDefine('mb-table-row', MbTableRow);
safeDefine('mb-table-cell', MbTableCell);
