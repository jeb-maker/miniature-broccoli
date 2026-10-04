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
        /* Shared control track so slotted fields / buttons / filters match height. */
        --mb-control-height: 2.5rem;
        --mb-control-height-sm: 2.5rem;
      }

      .end {
        margin-inline-start: auto;
      }

      /*
        Fields default to inline-size: 100% (form stacks). In a toolbar row,
        let them share the track instead of forcing a full-width wrap.
      */
      ::slotted(mb-input),
      ::slotted(mb-select),
      ::slotted(mb-combobox),
      ::slotted(mb-textarea) {
        flex: 1 1 12rem;
        inline-size: auto;
        max-inline-size: 20rem;
      }

      ::slotted(mb-segmented-control) {
        flex: 0 1 auto;
        max-inline-size: 100%;
      }

      /* Stretch interactive chrome across the row on narrow viewports. */
      @media (max-width: 36rem) {
        .toolbar {
          flex-direction: column;
          align-items: stretch;
        }

        .start,
        .end {
          flex-direction: column;
          align-items: stretch;
          inline-size: 100%;
          margin-inline-start: 0;
        }

        ::slotted(*),
        ::slotted(mb-input),
        ::slotted(mb-select),
        ::slotted(mb-combobox),
        ::slotted(mb-textarea),
        ::slotted(mb-button),
        ::slotted(mb-segmented-control) {
          flex: 1 1 auto;
          inline-size: 100%;
          max-inline-size: none;
        }
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
