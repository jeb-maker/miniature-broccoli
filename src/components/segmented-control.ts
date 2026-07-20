import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

/**
 * Navigational segmented control for MPA filter tabs.
 * Prefer slotted anchors with `aria-current="page"` on the active item.
 *
 * @example
 * <mb-segmented-control label="Filters">
 *   <a href="/all" aria-current="page">All</a>
 *   <a href="/mine">Mine</a>
 * </mb-segmented-control>
 */
export class MbSegmentedControl extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        max-inline-size: 100%;
      }

      .scroller {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        max-inline-size: 100%;
      }

      .list {
        display: inline-flex;
        min-inline-size: 100%;
        gap: 0;
        padding: var(--mb-space-1);
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-md);
        background: var(--mb-color-surface);
      }

      ::slotted(a),
      ::slotted(button) {
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--mb-color-muted);
        font: inherit;
        font-weight: 600;
        font-size: var(--mb-font-size-sm);
        text-decoration: none;
        padding-block: var(--mb-space-2);
        padding-inline: var(--mb-space-3);
        border-radius: var(--mb-radius-sm);
        white-space: nowrap;
        cursor: pointer;
      }

      ::slotted(a:focus-visible),
      ::slotted(button:focus-visible) {
        outline: var(--mb-focus-ring);
        outline-offset: var(--mb-focus-offset);
      }

      ::slotted([aria-current='page']),
      ::slotted([aria-selected='true']),
      ::slotted(.is-active) {
        background: var(--mb-color-accent-soft);
        color: var(--mb-color-accent);
      }
    `,
  ];

  /** Accessible name for the navigation region. */
  @property()
  label = 'Filters';

  override render() {
    return html`
      <nav part="nav" class="scroller" aria-label=${this.label}>
        <div part="list" class="list" role="list">
          <slot></slot>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-segmented-control': MbSegmentedControl;
  }
}

safeDefine('mb-segmented-control', MbSegmentedControl);
