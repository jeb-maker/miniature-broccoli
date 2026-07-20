import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export class MbPagination extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      nav {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: var(--mb-space-3);
      }

      .status {
        color: var(--mb-color-muted);
        font-size: var(--mb-font-size-sm);
      }

      .actions {
        display: inline-flex;
        gap: var(--mb-space-2);
      }

      a,
      span.disabled {
        display: inline-flex;
        align-items: center;
        min-block-size: 2.25rem;
        padding-inline: var(--mb-space-3);
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-md);
        background: var(--mb-color-surface);
        color: var(--mb-color-fg);
        font-size: var(--mb-font-size-sm);
        font-weight: 600;
        text-decoration: none;
      }

      span.disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    `,
  ];

  @property({ attribute: 'prev-url' })
  prevUrl = '';

  @property({ attribute: 'next-url' })
  nextUrl = '';

  @property({ type: Boolean, attribute: 'prev-disabled' })
  prevDisabled = false;

  @property({ type: Boolean, attribute: 'next-disabled' })
  nextDisabled = false;

  @property()
  status = '';

  @property({ attribute: 'prev-label' })
  prevLabel = 'Previous';

  @property({ attribute: 'next-label' })
  nextLabel = 'Next';

  @property()
  label = 'Pagination';

  override render() {
    const prevOff = this.prevDisabled || !this.prevUrl;
    const nextOff = this.nextDisabled || !this.nextUrl;

    return html`
      <nav part="nav" aria-label=${this.label}>
        <div part="status" class="status">${this.status}<slot name="status"></slot></div>
        <div part="actions" class="actions">
          <slot name="prev">
            ${prevOff
              ? html`<span class="disabled" aria-disabled="true">${this.prevLabel}</span>`
              : html`<a part="prev" href=${this.prevUrl}>${this.prevLabel}</a>`}
          </slot>
          <slot name="next">
            ${nextOff
              ? html`<span class="disabled" aria-disabled="true">${this.nextLabel}</span>`
              : html`<a part="next" href=${this.nextUrl}>${this.nextLabel}</a>`}
          </slot>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-pagination': MbPagination;
  }
}

safeDefine('mb-pagination', MbPagination);
