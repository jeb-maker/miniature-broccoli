import { LitElement, html, css } from 'lit';
import { state } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export class MbCard extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        inline-size: 100%;
      }

      .card {
        background: var(--mb-color-surface);
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-lg);
        overflow: clip;
        max-inline-size: 100%;
      }

      .header,
      .body,
      .footer {
        padding-block: var(--mb-space-4);
        padding-inline: var(--mb-space-5);
        min-inline-size: 0;
        overflow-wrap: anywhere;
      }

      .header {
        display: none;
        border-block-end: 1px solid var(--mb-color-border);
        font-family: var(--mb-font-display);
        font-weight: 650;
      }

      .footer {
        display: none;
        border-block-start: 1px solid var(--mb-color-border);
      }

      :host([data-has-header]) .header,
      :host([data-has-footer]) .footer {
        display: block;
      }

      ::slotted([slot='header']),
      ::slotted([slot='footer']) {
        display: block;
      }
    `,
  ];

  @state()
  private _hasHeader = false;

  @state()
  private _hasFooter = false;

  #onHeaderSlot(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this._hasHeader = slot.assignedNodes({ flatten: true }).length > 0;
    this.toggleAttribute('data-has-header', this._hasHeader);
  }

  #onFooterSlot(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this._hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
    this.toggleAttribute('data-has-footer', this._hasFooter);
  }

  override render() {
    return html`
      <article part="card" class="card">
        <header class="header" part="header">
          <slot name="header" @slotchange=${this.#onHeaderSlot}></slot>
        </header>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <footer class="footer" part="footer">
          <slot name="footer" @slotchange=${this.#onFooterSlot}></slot>
        </footer>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-card': MbCard;
  }
}

safeDefine('mb-card', MbCard);
