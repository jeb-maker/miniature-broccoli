import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type ToastVariant = 'success' | 'danger' | 'info';

/**
 * Transient status message. Keep the host outside HTMX swap targets (OOB-friendly).
 * Use `open` / `show()` / `hide()`, or dispatch `mb-toast` on `document` with detail.
 */
export class MbToast extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: fixed;
        inset-block-end: var(--mb-space-5);
        inset-inline: var(--mb-space-4);
        z-index: 1000;
        pointer-events: none;
      }

      :host(:not([open])) {
        visibility: hidden;
      }

      .toast {
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--mb-space-3);
        max-inline-size: 28rem;
        margin-inline: auto;
        padding-block: var(--mb-space-3);
        padding-inline: var(--mb-space-4);
        border-radius: var(--mb-radius-md);
        border: 1px solid var(--mb-color-info);
        border-inline-start-width: 4px;
        background: var(--mb-color-info-soft);
        box-shadow: var(--mb-shadow);
        color: var(--mb-color-fg);
      }

      :host([variant='success']) .toast {
        border-color: var(--mb-color-success);
        background: var(--mb-color-success-soft);
      }

      :host([variant='danger']) .toast {
        border-color: var(--mb-color-danger);
        background: var(--mb-color-danger-soft);
      }

      :host([variant='info']) .toast {
        border-color: var(--mb-color-info);
        background: var(--mb-color-info-soft);
      }

      .message {
        flex: 1;
        font-size: var(--mb-font-size-sm);
        font-weight: 600;
      }

      button {
        appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        min-inline-size: 1.5rem;
        min-block-size: 1.5rem;
        margin-block-start: -0.15rem;
        border: 0;
        border-radius: var(--mb-radius-sm);
        background: transparent;
        color: inherit;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        line-height: 1;
        padding: 0;
        transition: background-color var(--mb-transition);
      }

      button:hover {
        background: var(--mb-color-hover);
      }

      button:active {
        background: var(--mb-color-border);
      }
    `,
  ];

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ reflect: true })
  variant: ToastVariant = 'info';

  /** Auto-dismiss delay in ms. `0` disables. */
  @property({ type: Number, attribute: 'auto-dismiss' })
  autoDismiss = 4000;

  @property()
  message = '';

  #timer = 0;
  #onBus = (event: Event): void => {
    const detail = (event as CustomEvent<{ message?: string; variant?: ToastVariant; autoDismiss?: number }>).detail;
    if (!detail) return;
    if (detail.variant) this.variant = detail.variant;
    if (detail.message != null) this.message = detail.message;
    if (detail.autoDismiss != null) this.autoDismiss = detail.autoDismiss;
    this.show();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('mb-toast', this.#onBus as EventListener);
    if (this.open) this.#armTimer();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('mb-toast', this.#onBus as EventListener);
    this.#clearTimer();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('open') || changed.has('autoDismiss')) {
      if (this.open) this.#armTimer();
      else this.#clearTimer();
    }
  }

  show(message?: string, variant?: ToastVariant): void {
    if (message != null) this.message = message;
    if (variant) this.variant = variant;
    this.open = true;
    if (this.isConnected) this.#armTimer();
  }

  hide(): void {
    this.open = false;
  }

  #armTimer(): void {
    this.#clearTimer();
    if (this.autoDismiss > 0) {
      this.#timer = window.setTimeout(() => this.hide(), this.autoDismiss);
    }
  }

  #clearTimer(): void {
    if (this.#timer) {
      window.clearTimeout(this.#timer);
      this.#timer = 0;
    }
  }

  #onClose(): void {
    this.hide();
    this.dispatchEvent(
      new CustomEvent('mb-close', { bubbles: true, composed: true }),
    );
  }

  override render() {
    const role = this.variant === 'danger' ? 'alert' : 'status';
    return html`
      <div
        part="toast"
        class="toast"
        role=${role}
        aria-live=${this.variant === 'danger' ? 'assertive' : 'polite'}
        ?hidden=${!this.open}
      >
        <div part="message" class="message">${this.message}<slot></slot></div>
        <button type="button" part="close" aria-label="Dismiss" @click=${this.#onClose}>
          ×
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-toast': MbToast;
  }
}

safeDefine('mb-toast', MbToast);
