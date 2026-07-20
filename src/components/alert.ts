import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export class DsAlert extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .alert {
        padding-block: var(--ds-space-3);
        padding-inline: var(--ds-space-4);
        border-radius: var(--ds-radius-md);
        border-inline-start: 4px solid currentColor;
        background: var(--ds-color-info-soft);
        color: var(--ds-color-info);
      }

      :host([variant='success']) .alert {
        background: var(--ds-color-success-soft);
        color: var(--ds-color-success);
      }

      :host([variant='warning']) .alert {
        background: var(--ds-color-warning-soft);
        color: var(--ds-color-warning);
      }

      :host([variant='danger']) .alert {
        background: var(--ds-color-danger-soft);
        color: var(--ds-color-danger);
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
    'ds-alert': DsAlert;
  }
}

safeDefine('ds-alert', DsAlert);
