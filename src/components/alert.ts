import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export class MbAlert extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        inline-size: 100%;
      }

      .alert {
        padding-block: var(--mb-space-3);
        padding-inline: var(--mb-space-4);
        border-radius: var(--mb-radius-md);
        border-inline-start: 4px solid currentColor;
        background: var(--mb-color-info-soft);
        color: var(--mb-color-info);
        overflow-wrap: anywhere;
        max-inline-size: 100%;
      }

      :host([variant='success']) .alert {
        background: var(--mb-color-success-soft);
        color: var(--mb-color-success);
      }

      :host([variant='warning']) .alert {
        background: var(--mb-color-warning-soft);
        color: var(--mb-color-warning);
      }

      :host([variant='danger']) .alert {
        background: var(--mb-color-danger-soft);
        color: var(--mb-color-danger);
      }
    `,
  ];

  @property({ reflect: true })
  variant: AlertVariant = 'info';

  get #role(): 'status' | 'alert' {
    return this.variant === 'warning' || this.variant === 'danger' ? 'alert' : 'status';
  }

  override render() {
    return html`
      <div part="base" class="alert" role=${this.#role}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-alert': MbAlert;
  }
}

safeDefine('mb-alert', MbAlert);
