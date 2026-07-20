import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export class DsBadge extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
      }

      span {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-1);
        padding-block: 0.15rem;
        padding-inline: var(--ds-space-2);
        border-radius: var(--ds-radius-sm);
        font-size: var(--ds-font-size-sm);
        font-weight: 600;
        line-height: 1.3;
        background: var(--ds-color-border);
        color: var(--ds-color-fg);
      }

      :host([variant='success']) span {
        background: var(--ds-color-success-soft);
        color: var(--ds-color-success);
      }

      :host([variant='warning']) span {
        background: var(--ds-color-warning-soft);
        color: var(--ds-color-warning);
      }

      :host([variant='danger']) span {
        background: var(--ds-color-danger-soft);
        color: var(--ds-color-danger);
      }

      :host([variant='info']) span {
        background: var(--ds-color-info-soft);
        color: var(--ds-color-info);
      }
    `,
  ];

  @property({ reflect: true })
  variant: BadgeVariant = 'neutral';

  override render() {
    return html`<span part="base"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-badge': DsBadge;
  }
}

safeDefine('ds-badge', DsBadge);
