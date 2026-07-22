import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

/**
 * Mobile hamburger control for `mb-nav`.
 * Sets `aria-expanded` and toggles `open` on the target nav (by id) or dispatches `mb-toggle`.
 */
export class MbNavToggle extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: none;
      }

      @media (max-width: 36rem) {
        :host {
          display: inline-flex;
        }
      }

      button {
        appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-inline-size: 2.5rem;
        min-block-size: 2.5rem;
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-md);
        background: var(--mb-color-surface);
        color: var(--mb-color-fg);
        cursor: pointer;
        font: inherit;
        font-weight: 700;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true })
  expanded = false;

  /** `id` of the `mb-nav` to toggle. */
  @property({ attribute: 'for' })
  for = '';

  @property({ attribute: 'label-open' })
  labelOpen = 'Menu';

  @property({ attribute: 'label-close' })
  labelClose = 'Close menu';

  #onClick(): void {
    this.expanded = !this.expanded;
    const nav = this.for ? document.getElementById(this.for) : null;
    if (nav) {
      nav.toggleAttribute('open', this.expanded);
      if ('open' in nav) {
        (nav as HTMLElement & { open: boolean }).open = this.expanded;
      }
    }
    this.dispatchEvent(
      new CustomEvent('mb-toggle', {
        detail: { expanded: this.expanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <button
        part="button"
        type="button"
        aria-expanded=${this.expanded ? 'true' : 'false'}
        aria-controls=${this.for || nothing}
        aria-label=${this.expanded ? this.labelClose : this.labelOpen}
        @click=${this.#onClick}
      >
        <slot>${this.expanded ? '✕' : '☰'}</slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-nav-toggle': MbNavToggle;
  }
}

safeDefine('mb-nav-toggle', MbNavToggle);
