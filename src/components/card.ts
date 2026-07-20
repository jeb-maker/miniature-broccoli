import { LitElement, html, css } from 'lit';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export class MbCard extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .card {
        background: var(--mb-color-surface);
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-lg);
        overflow: clip;
      }

      .header,
      .body,
      .footer {
        padding-block: var(--mb-space-4);
        padding-inline: var(--mb-space-5);
      }

      .header {
        border-block-end: 1px solid var(--mb-color-border);
        font-family: var(--mb-font-display);
        font-weight: 650;
      }

      .footer {
        border-block-start: 1px solid var(--mb-color-border);
      }

      ::slotted([slot='header']),
      ::slotted([slot='footer']) {
        display: block;
      }
    `,
  ];

  override render() {
    return html`
      <article part="card" class="card">
        <header class="header" part="header">
          <slot name="header"></slot>
        </header>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <footer class="footer" part="footer">
          <slot name="footer"></slot>
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
