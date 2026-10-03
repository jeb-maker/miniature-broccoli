import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../../lib/safe-define.js';
import { sharedStyles } from '../../lib/styles.js';
import { tableCellStyles } from './styles.js';
import type { TableCellAlign, TableSortDirection } from './types.js';
import type { MbTable } from './mb-table.js';

export class MbTableCell extends LitElement {
  static override styles = [sharedStyles, tableCellStyles];

  /** Visible field label in card layout (auto-filled from head when empty). */
  @property()
  label = '';

  @property({ reflect: true })
  align: TableCellAlign = 'start';

  /** Emphasize this cell as the card title on narrow viewports. */
  @property({ type: Boolean, reflect: true })
  primary = false;

  /**
   * Never show the cards-mode field label (and skip auto-copy from head).
   * Use for checkbox-only cells or columns that already label themselves.
   */
  @property({ type: Boolean, reflect: true, attribute: 'hide-label' })
  hideLabel = false;

  /**
   * Toolbar / actions cell: hide cards label and end-align content.
   * Prefer on icon-button columns with an empty head cell.
   */
  @property({ type: Boolean, reflect: true })
  actions = false;

  /** Column key used for sorting when this is a head cell. */
  @property({ attribute: 'sort-key', reflect: true })
  sortKey = '';

  /** Explicit sortable affordance (implied when `sort-key` is set). */
  @property({ type: Boolean, reflect: true })
  sortable = false;

  /** Explicit value used when sorting this column. */
  @property({ attribute: 'sort-value' })
  sortValue = '';

  @property({ type: Boolean, reflect: true, attribute: 'sort-active' })
  sortActive = false;

  @property({ attribute: false })
  sortDirection: TableSortDirection | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#syncRole();
  }

  override attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, old, value);
    if (name === 'data-sort-label' && old !== value) {
      this.requestUpdate();
    }
  }

  override updated(changed: Map<string, unknown>): void {
    this.#syncRole();
    if (changed.has('sortKey') && this.sortKey.trim()) {
      this.sortable = true;
    }
    if (
      (changed.has('hideLabel') || changed.has('actions')) &&
      (this.hideLabel || this.actions)
    ) {
      this.dataset.labelLocked = 'true';
      if (this.label) this.label = '';
    }
    if (this.#isHead() && this.sortKey.trim()) {
      const ariaSort =
        this.sortActive && this.sortDirection ? this.sortDirection : 'none';
      this.setAttribute('aria-sort', ariaSort);
    } else {
      this.removeAttribute('aria-sort');
    }
  }

  #isHead(): boolean {
    const row = this.parentElement;
    return row?.slot === 'head' || row?.hasAttribute('head') === true;
  }

  #syncRole(): void {
    this.setAttribute('role', this.#isHead() ? 'columnheader' : 'cell');
  }

  #indicator(): string {
    if (!this.sortActive || !this.sortDirection) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  #sortAriaLabel(): string {
    const name =
      this.sortKey.trim() ||
      this.label.trim() ||
      (this.textContent ?? '').replace(/\s+/g, ' ').trim() ||
      'column';
    const template =
      this.getAttribute('data-sort-label')?.trim() ||
      this.closest<MbTable>('mb-table')?.sortLabel?.trim() ||
      'Sort by {name}';
    return template.includes('{name}')
      ? template.replace(/\{name\}/g, name)
      : `${template} ${name}`.trim();
  }

  override render() {
    const showLabel =
      Boolean(this.label) &&
      this.getAttribute('data-mode') === 'cards' &&
      !this.#isHead() &&
      !this.hideLabel &&
      !this.actions;
    const isSortableHead = this.#isHead() && (this.sortable || Boolean(this.sortKey.trim()));

    return html`
      <div part="cell" class="cell">
        <span part="label" class="label" ?hidden=${!showLabel}>${this.label}</span>
        <div part="value" class="value">
          ${isSortableHead
            ? html`
                <button
                  type="button"
                  part="sort"
                  class="sort"
                  aria-label=${this.#sortAriaLabel()}
                >
                  <slot></slot>
                  <span class="sort-indicator" aria-hidden="true">${this.#indicator()}</span>
                </button>
              `
            : html`<slot></slot>`}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-table-cell': MbTableCell;
  }
}

safeDefine('mb-table-cell', MbTableCell);
