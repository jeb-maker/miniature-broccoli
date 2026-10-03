import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../../lib/safe-define.js';
import { sharedStyles } from '../../lib/styles.js';
import { tableRowStyles } from './styles.js';
import type { MbTable } from './mb-table.js';

export class MbTableRow extends LitElement {
  static override styles = [sharedStyles, tableRowStyles];

  @property({ type: Boolean, reflect: true })
  head = false;

  /** Section id referencing an entry in `mb-table.sections`. */
  @property({ reflect: true })
  section = '';

  /** Fallback sort value when cell `sort-value` / control value is empty. */
  @property({ attribute: 'sort-value' })
  sortValue = '';

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'row');
    if (this.head && this.slot !== 'head') {
      this.slot = 'head';
    }
  }

  override attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, old, value);
    if (name === 'data-reorder-label' && old !== value) {
      this.requestUpdate();
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('head') && this.head) {
      this.slot = 'head';
    }
    if (changed.has('section')) {
      const prev = changed.get('section');
      // Skip the initial undefined → value hydration; slotchange handles first paint.
      if (prev !== undefined || this.section) {
        const table = this.closest<MbTable>('mb-table');
        if (table && prev !== undefined) {
          table.refreshRows();
        }
      }
    }
    const isHead = this.slot === 'head' || this.head;
    const hideHead = isHead && this.getAttribute('data-mode') === 'cards';
    if (hideHead) {
      this.setAttribute('aria-hidden', 'true');
    } else {
      this.removeAttribute('aria-hidden');
    }
  }

  #onHandlePointerDown = (event: PointerEvent): void => {
    const table = this.closest<MbTable>('mb-table');
    table?.beginReorder(this, event);
  };

  #onHandleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const table = this.closest<MbTable>('mb-table');
    table?.moveRowByKeyboard(this, event.key === 'ArrowUp' ? -1 : 1);
  };

  #reorderAriaLabel(): string {
    return (
      this.getAttribute('data-reorder-label')?.trim() ||
      this.closest<MbTable>('mb-table')?.reorderLabel?.trim() ||
      'Drag to reorder'
    );
  }

  override render() {
    const reorderable = this.hasAttribute('data-reorderable');
    const spacer = this.hasAttribute('data-reorder-spacer');

    return html`
      <div part="wrap" class="wrap">
        ${reorderable
          ? html`
              <button
                type="button"
                part="handle"
                class="handle"
                aria-label=${this.#reorderAriaLabel()}
                aria-keyshortcuts="ArrowUp ArrowDown"
                @pointerdown=${this.#onHandlePointerDown}
                @keydown=${this.#onHandleKeyDown}
              >
                ⠿
              </button>
            `
          : spacer
            ? html`<span class="spacer" aria-hidden="true"></span>`
            : nothing}
        <div part="row" class="row">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-table-row': MbTableRow;
  }
}

safeDefine('mb-table-row', MbTableRow);
