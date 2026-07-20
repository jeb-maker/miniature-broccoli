import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export class MbBadge extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
      }

      span {
        display: inline-flex;
        align-items: center;
        gap: var(--mb-space-1);
        padding-block: 0.15rem;
        padding-inline: var(--mb-space-2);
        border-radius: var(--mb-radius-sm);
        font-size: var(--mb-font-size-sm);
        font-weight: 600;
        line-height: 1.3;
        background: var(--mb-color-border);
        color: var(--mb-color-fg);
      }

      :host([variant='success']) span {
        background: var(--mb-color-success-soft);
        color: var(--mb-color-success);
      }

      :host([variant='warning']) span {
        background: var(--mb-color-warning-soft);
        color: var(--mb-color-warning);
      }

      :host([variant='danger']) span {
        background: var(--mb-color-danger-soft);
        color: var(--mb-color-danger);
      }

      :host([variant='info']) span {
        background: var(--mb-color-info-soft);
        color: var(--mb-color-info);
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
    'mb-badge': MbBadge;
  }
}

safeDefine('mb-badge', MbBadge);
