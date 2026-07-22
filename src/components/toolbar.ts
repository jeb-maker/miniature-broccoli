import { LitElement, html, css } from 'lit';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

/**
 * List-page toolbar: filters/search in `start` (or default), primary actions in `end`.
 */
export class MbToolbar extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        inline-size: 100%;
      }

      .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: var(--mb-space-3);
      }

      .start,
      .end {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--mb-space-2);
        min-inline-size: 0;
      }

      .end {
        margin-inline-start: auto;
      }
    `,
  ];

  override render() {
    return html`
      <div part="toolbar" class="toolbar">
        <div part="start" class="start">
          <slot name="start"></slot>
          <slot></slot>
        </div>
        <div part="end" class="end">
          <slot name="end"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-toolbar': MbToolbar;
  }
}

safeDefine('mb-toolbar', MbToolbar);
