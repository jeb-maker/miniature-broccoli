import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export class MbModal extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: contents;
      }

      dialog {
        border: 1px solid var(--mb-color-border);
        border-radius: var(--mb-radius-lg);
        padding: 0;
        background: var(--mb-color-surface);
        color: var(--mb-color-fg);
        box-shadow: var(--mb-shadow);
        /* Avoid 100vw — it includes scrollbar gutters and overflows on mobile */
        inline-size: min(32rem, calc(100% - 2rem));
        max-inline-size: calc(100% - 2rem);
        margin: auto;
      }

      dialog::backdrop {
        background: rgb(20 32 27 / 45%);
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: var(--mb-space-4);
        padding: var(--mb-space-5);
        min-inline-size: 0;
        max-inline-size: 100%;
      }

      .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--mb-space-3);
        min-inline-size: 0;
      }

      .title {
        font-family: var(--mb-font-display);
        font-size: var(--mb-font-size-xl);
        font-weight: 650;
        margin: 0;
        min-inline-size: 0;
        flex: 1;
        overflow-wrap: anywhere;
      }

      .close {
        border: 0;
        background: transparent;
        color: var(--mb-color-muted);
        font-size: 1.25rem;
        line-height: 1;
        cursor: pointer;
        padding: var(--mb-space-1);
        border-radius: var(--mb-radius-sm);
        flex-shrink: 0;
      }
    `,
  ];

  @property({ type: Boolean, reflect: true })
  open = false;

  @property()
  heading = '';

  #dialog?: HTMLDialogElement;
  /** True while we are closing from the `open` property path (avoid double emit). */
  #closingFromProp = false;

  override firstUpdated(): void {
    this.#dialog = this.renderRoot.querySelector('dialog') ?? undefined;
    this.#dialog?.addEventListener('close', () => {
      if (this.#closingFromProp) {
        return;
      }
      // Escape / backdrop — native close. Sync property + notify.
      if (this.open) {
        this.open = false;
      }
      this.#emitClose();
    });
    this.#syncOpen();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('open')) {
      this.#syncOpen();
    }
  }

  #syncOpen(): void {
    const dialog = this.#dialog;
    if (!dialog) return;
    if (this.open && !dialog.open) {
      dialog.showModal();
    } else if (!this.open && dialog.open) {
      this.#closingFromProp = true;
      dialog.close();
      this.#closingFromProp = false;
      this.#emitClose();
    }
  }

  #emitClose(): void {
    this.dispatchEvent(
      new CustomEvent('mb-close', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Close the modal (idempotent). Always emits `mb-close` when a close occurs. */
  close(): void {
    if (!this.open && !this.#dialog?.open) {
      return;
    }
    this.open = false;
  }

  #onCloseClick(): void {
    this.close();
  }

  override render() {
    return html`
      <dialog part="dialog" aria-labelledby="title" aria-modal="true">
        <div class="panel">
          <div class="header">
            <h2 class="title" id="title">${this.heading}<slot name="heading"></slot></h2>
            <button class="close" type="button" aria-label="Close" @click=${this.#onCloseClick}>
              ×
            </button>
          </div>
          <div part="body">
            <slot></slot>
          </div>
          <div part="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-modal': MbModal;
  }
}

safeDefine('mb-modal', MbModal);
