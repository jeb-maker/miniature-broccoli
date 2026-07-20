import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

/**
 * Radio option for use inside `mb-radio-group`.
 * Not form-associated on its own — the group owns FormData / validity.
 */
export class MbRadio extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
      }

      label {
        display: inline-flex;
        align-items: flex-start;
        gap: var(--mb-space-2);
        cursor: pointer;
        font-size: var(--mb-font-size-md);
      }

      input {
        margin-block-start: 0.2rem;
        accent-color: var(--mb-color-accent);
      }

      :host([disabled]) label {
        opacity: 0.55;
        cursor: not-allowed;
      }
    `,
  ];

  @property()
  value = '';

  @property()
  label = '';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Set by the parent radio group. */
  @property()
  name = '';

  #input?: HTMLInputElement;

  override firstUpdated(): void {
    this.#input = this.renderRoot.querySelector('input') ?? undefined;
  }

  focus(options?: FocusOptions): void {
    this.#input?.focus(options);
  }

  #onChange(): void {
    this.checked = true;
    this.dispatchEvent(
      new CustomEvent('mb-radio-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <label part="label">
        <input
          part="control"
          type="radio"
          name=${this.name || nothing}
          .value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.#onChange}
        />
        <span>${this.label}<slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-radio': MbRadio;
  }
}

safeDefine('mb-radio', MbRadio);
