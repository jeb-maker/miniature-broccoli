import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

/**
 * Status / taxonomy chip. One primitive for both:
 * - status labels → `variant` (compact `size="sm"` default)
 * - filterable labels → optional `href` (use `size="md"` in toolbars)
 *
 * Prefer `mb-badge` over `mb-tag` (tag is a compatibility alias).
 */
export class MbBadge extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        max-inline-size: 100%;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: var(--mb-space-1);
        max-inline-size: 100%;
        min-block-size: 1.5rem;
        padding-block: 0.15rem;
        padding-inline: var(--mb-space-2);
        border: 1px solid var(--mb-color-border-strong);
        border-radius: var(--mb-radius-sm);
        background: var(--mb-color-bg);
        color: var(--mb-color-fg);
        font-size: var(--mb-font-size-sm);
        font-weight: 600;
        line-height: var(--mb-line-height-tight);
        text-decoration: none;
        overflow-wrap: anywhere;
        transition:
          background-color var(--mb-transition),
          border-color var(--mb-transition);
      }

      :host([size='md']) .chip {
        min-block-size: var(--mb-control-height-sm, 2rem);
        padding-block: var(--mb-space-1);
        padding-inline: var(--mb-space-3);
        border-radius: var(--mb-radius-md);
      }

      :host([variant='success']) .chip {
        background: var(--mb-color-success-soft);
        color: var(--mb-color-success);
        border-color: var(--mb-color-success);
      }

      :host([variant='warning']) .chip {
        background: var(--mb-color-warning-soft);
        color: var(--mb-color-warning);
        border-color: var(--mb-color-warning);
      }

      :host([variant='danger']) .chip {
        background: var(--mb-color-danger-soft);
        color: var(--mb-color-danger);
        border-color: var(--mb-color-danger);
      }

      :host([variant='info']) .chip {
        background: var(--mb-color-info-soft);
        color: var(--mb-color-info);
        border-color: var(--mb-color-info);
      }

      a.chip:hover {
        background-image: linear-gradient(var(--mb-color-hover), var(--mb-color-hover));
        border-color: var(--mb-color-border-hover);
      }

      a.chip:active {
        background-image: none;
        background-color: var(--mb-color-bg);
        border-color: var(--mb-color-border-hover);
      }

      :host([variant='success']) a.chip:hover,
      :host([variant='warning']) a.chip:hover,
      :host([variant='danger']) a.chip:hover,
      :host([variant='info']) a.chip:hover {
        filter: brightness(0.97);
      }
    `,
  ];

  @property({ reflect: true })
  variant: BadgeVariant = 'neutral';

  /** When set, render a styled anchor (filterable / navigable chip). */
  @property({ reflect: true })
  href = '';

  /**
   * `sm` — compact status (default, tables / timelines).
   * `md` — control-sm height (toolbars / filter rows).
   */
  @property({ reflect: true })
  size: BadgeSize = 'sm';

  override render() {
    if (this.href) {
      return html`
        <a part="base" class="chip" href=${this.href}>
          <slot></slot>
        </a>
      `;
    }
    return html`<span part="base" class="chip"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-badge': MbBadge;
  }
}

safeDefine('mb-badge', MbBadge);
