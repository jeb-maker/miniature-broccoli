import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { setFormValue } from '../lib/form.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Form-associated button. Use the default slot for the label.
 * Submit/reset participate via requestSubmit/reset — their name/value
 * is only applied when this control is the submitter (click).
 */
export class MbButton extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--mb-space-2);
        max-inline-size: 100%;
        border: 1px solid transparent;
        border-radius: var(--mb-radius-md);
        font: inherit;
        font-weight: 600;
        cursor: pointer;
        white-space: normal;
        text-align: center;
        overflow-wrap: anywhere;
        transition:
          background-color var(--mb-transition),
          color var(--mb-transition),
          border-color var(--mb-transition),
          opacity var(--mb-transition);
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      :host([size='sm']) button {
        min-block-size: 2rem;
        padding-inline: var(--mb-space-3);
        font-size: var(--mb-font-size-sm);
      }

      :host([size='md']) button {
        min-block-size: 2.5rem;
        padding-inline: var(--mb-space-4);
        font-size: var(--mb-font-size-md);
      }

      :host([size='lg']) button {
        min-block-size: 3rem;
        padding-inline: var(--mb-space-5);
        font-size: var(--mb-font-size-lg);
      }

      :host([variant='primary']) button {
        background: var(--mb-color-accent);
        color: var(--mb-color-on-accent);
      }

      :host([variant='secondary']) button {
        background: var(--mb-color-surface);
        color: var(--mb-color-fg);
        border-color: var(--mb-color-border);
      }

      :host([variant='ghost']) button {
        background: transparent;
        color: var(--mb-color-accent);
      }

      .spinner {
        inline-size: 1em;
        block-size: 1em;
        border: 2px solid currentColor;
        border-inline-end-color: transparent;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ];

  @property({ reflect: true })
  variant: ButtonVariant = 'primary';

  @property({ reflect: true })
  size: ButtonSize = 'md';

  @property({ reflect: true })
  type: ButtonType = 'button';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ reflect: true })
  name = '';

  @property()
  value = '';

  #internals = this.attachInternals();
  #formDisabled = false;

  get #isDisabled(): boolean {
    return this.disabled || this.loading || this.#formDisabled;
  }

  formDisabledCallback(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.requestUpdate();
  }

  #onClick(event: MouseEvent): void {
    if (this.#isDisabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const form = this.#internals.form;
    if (!form) return;

    if (this.type === 'submit') {
      // Apply name/value only for this submission, then clear so other submits
      // do not keep including this button's entry (native submitter semantics).
      if (this.name) {
        setFormValue(this.#internals, this.value);
      }
      form.requestSubmit();
      queueMicrotask(() => setFormValue(this.#internals, null));
    } else if (this.type === 'reset') {
      form.reset();
    }
  }

  override render() {
    return html`
      <button
        part="base"
        type="button"
        ?disabled=${this.#isDisabled}
        aria-busy=${this.loading ? 'true' : 'false'}
        @click=${this.#onClick}
      >
        ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-button': MbButton;
  }
}

safeDefine('mb-button', MbButton);
