import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

/**
 * Neutral chip (surface + border). Distinct from `mb-badge` status variants.
 * With `href`, renders a styled anchor for filterable tags.
 */
export class MbTag extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        max-inline-size: 100%;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        gap: var(--mb-space-1);
        max-inline-size: 100%;
        padding-block: 0.15rem;
        padding-inline: var(--mb-space-2);
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-sm);
        background: var(--mb-color-surface);
        color: var(--mb-color-fg);
        font-size: var(--mb-font-size-sm);
        font-weight: 600;
        line-height: 1.3;
        text-decoration: none;
        overflow-wrap: anywhere;
      }

      :host([size='sm']) .tag {
        font-size: 0.75rem;
        padding-inline: 0.4rem;
      }
    `,
  ];

  @property({ reflect: true })
  href = '';

  @property({ reflect: true })
  size: 'sm' | 'md' = 'md';

  override render() {
    if (this.href) {
      return html`
        <a part="base" class="tag" href=${this.href}>
          <slot></slot>
        </a>
      `;
    }
    return html`<span part="base" class="tag"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-tag': MbTag;
  }
}

safeDefine('mb-tag', MbTag);
