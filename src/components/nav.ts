import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

/**
 * Horizontal app-shell nav links. Active item via `aria-current="page"` on slotted anchors.
 * Shell layout stays host-owned; this is the link list primitive only.
 */
export class MbNav extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }

      nav {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--mb-space-1) var(--mb-space-3);
      }

      ::slotted(a) {
        color: var(--mb-color-muted);
        font-weight: 600;
        font-size: var(--mb-font-size-sm);
        text-decoration: none;
        padding-block: var(--mb-space-2);
        padding-inline: var(--mb-space-2);
        border-radius: var(--mb-radius-sm);
      }

      ::slotted(a:hover) {
        color: var(--mb-color-fg);
      }

      ::slotted(a[aria-current='page']),
      ::slotted(a.is-active) {
        color: var(--mb-color-accent);
        background: var(--mb-color-accent-soft);
      }

      ::slotted(a:focus-visible) {
        outline: var(--mb-focus-ring);
        outline-offset: var(--mb-focus-offset);
      }

      @media (max-width: 36rem) {
        :host(:not([open]):not([data-always-visible])) {
          display: none;
        }
      }
    `,
  ];

  @property()
  label = 'Primary';

  /** When set (typically by mb-nav-toggle), nav is shown on narrow viewports. */
  @property({ type: Boolean, reflect: true })
  open = false;

  override render() {
    return html`
      <nav part="nav" aria-label=${this.label}>
        <slot></slot>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-nav': MbNav;
  }
}

safeDefine('mb-nav', MbNav);
