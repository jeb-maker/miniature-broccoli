import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { setFormValue } from '../lib/form.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Form-associated button. Use the default slot for the label.
 * Submit/reset participate via requestSubmit/reset — their name/value
 * is only applied when this control is the submitter (click).
 * When `href` is set, renders a styled anchor (no form association on click).
 */
export class MbButton extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }

      .base {
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
        text-decoration: none;
        overflow-wrap: anywhere;
        transition:
          background-color var(--mb-transition),
          color var(--mb-transition),
          border-color var(--mb-transition),
          opacity var(--mb-transition);
      }

      .base:disabled,
      .base[aria-disabled='true'] {
        cursor: not-allowed;
        opacity: 0.55;
        pointer-events: none;
      }

      :host([size='sm']) .base {
        min-block-size: 2rem;
        padding-inline: var(--mb-space-3);
        font-size: var(--mb-font-size-sm);
      }

      :host([size='md']) .base {
        min-block-size: 2.5rem;
        padding-inline: var(--mb-space-4);
        font-size: var(--mb-font-size-md);
      }

      :host([size='lg']) .base {
        min-block-size: 3rem;
        padding-inline: var(--mb-space-5);
        font-size: var(--mb-font-size-lg);
      }

      :host([icon-only][size='sm']) .base {
        min-inline-size: 2rem;
        padding-inline: 0;
      }

      :host([icon-only][size='md']) .base,
      :host([icon-only]:not([size])) .base {
        min-inline-size: 2.5rem;
        padding-inline: 0;
      }

      :host([icon-only][size='lg']) .base {
        min-inline-size: 3rem;
        padding-inline: 0;
      }

      :host([variant='primary']) .base {
        background: var(--mb-color-accent);
        color: var(--mb-color-on-accent);
      }

      :host([variant='secondary']) .base {
        background: var(--mb-color-surface);
        color: var(--mb-color-fg);
        border-color: var(--mb-color-border);
      }

      :host([variant='ghost']) .base {
        background: transparent;
        color: var(--mb-color-accent);
      }

      :host([variant='danger']) .base {
        background: var(--mb-color-danger);
        color: var(--mb-color-on-danger);
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

  /** When set, render an `<a>` with button styles (progressive-enhancement CTAs). */
  @property({ reflect: true })
  href = '';

  @property({ reflect: true })
  target = '';

  @property({ reflect: true })
  rel = '';

  @property({ type: Boolean, reflect: true, attribute: 'icon-only' })
  iconOnly = false;

  #internals = this.attachInternals();
  #formDisabled = false;

  get #isDisabled(): boolean {
    return this.disabled || this.loading || this.#formDisabled;
  }

  get #isLink(): boolean {
    return Boolean(this.href);
  }

  get #accessibleName(): string {
    return this.getAttribute('aria-label') ?? '';
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

    if (this.#isLink) return;

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
    const content = html`
      ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
      <slot></slot>
    `;
    const named = this.#accessibleName || nothing;

    if (this.#isLink) {
      return html`
        <a
          part="base"
          class="base"
          href=${this.#isDisabled ? nothing : this.href}
          target=${this.target || nothing}
          rel=${this.rel || (this.target === '_blank' ? 'noopener noreferrer' : nothing)}
          aria-disabled=${this.#isDisabled ? 'true' : 'false'}
          aria-busy=${this.loading ? 'true' : 'false'}
          aria-label=${named}
          @click=${this.#onClick}
        >
          ${content}
        </a>
      `;
    }

    return html`
      <button
        part="base"
        class="base"
        type="button"
        ?disabled=${this.#isDisabled}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-label=${named}
        @click=${this.#onClick}
      >
        ${content}
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
