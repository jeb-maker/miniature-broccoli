import { LitElement, html, css } from 'lit';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export class DsCard extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .card {
        background: var(--ds-color-surface);
        border: 1px solid var(--ds-color-border);
        border-radius: var(--ds-radius-lg);
        overflow: clip;
      }

      .header,
      .body,
      .footer {
        padding-block: var(--ds-space-4);
        padding-inline: var(--ds-space-5);
      }

      .header {
        border-block-end: 1px solid var(--ds-color-border);
        font-family: var(--ds-font-display);
        font-weight: 650;
      }

      .footer {
        border-block-start: 1px solid var(--ds-color-border);
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
    'ds-card': DsCard;
  }
}

safeDefine('ds-card', DsCard);
