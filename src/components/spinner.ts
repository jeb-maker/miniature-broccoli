import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type SpinnerSize = 'sm' | 'md';

/**
 * Standalone indeterminate spinner for HTMX indicators (row-level, outside buttons).
 * Toggle with `hidden`, a host class, or HTMX `hx-indicator`.
 */
export class MbSpinner extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }

      .spinner {
        border: 2px solid var(--mb-color-border);
        border-inline-end-color: var(--mb-color-accent);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }

      :host([size='sm']) .spinner {
        inline-size: 0.9rem;
        block-size: 0.9rem;
      }

      :host([size='md']) .spinner,
      :host(:not([size])) .spinner {
        inline-size: 1.15rem;
        block-size: 1.15rem;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .spinner {
          animation: none;
          border-inline-end-color: var(--mb-color-border);
          border-block-start-color: var(--mb-color-accent);
        }
      }
    `,
  ];

  @property({ reflect: true })
  size: SpinnerSize = 'md';

  @property()
  label = 'Loading';

  override render() {
    return html`
      <span
        part="spinner"
        class="spinner"
        role="status"
        aria-label=${this.label}
      ></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-spinner': MbSpinner;
  }
}

safeDefine('mb-spinner', MbSpinner);
