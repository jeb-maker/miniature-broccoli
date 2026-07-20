import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { clearValidity, setFormValue, setValidity } from '../lib/form.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';

export class MbCheckbox extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: inline-block;
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
        inline-size: 1.1rem;
        block-size: 1.1rem;
      }

      input:disabled {
        cursor: not-allowed;
      }

      :host([disabled]) label {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .error {
        margin: var(--mb-space-1) 0 0;
        color: var(--mb-color-danger);
        font-size: var(--mb-font-size-sm);
      }
    `,
  ];

  @property()
  label = '';

  @property()
  error = '';

  @property({ reflect: true })
  name = '';

  @property()
  value = 'on';

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  #internals = this.attachInternals();
  #formDisabled = false;
  #control?: HTMLInputElement;
  #defaultChecked = false;
  #defaultCaptured = false;
  #touched = false;

  get #isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.#defaultCaptured) {
      this.#defaultChecked = this.checked;
      this.#defaultCaptured = true;
    }
  }

  override firstUpdated(): void {
    this.#control = this.renderRoot.querySelector('input') ?? undefined;
    this.#applyIndeterminate();
    this.#sync();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('indeterminate')) {
      this.#applyIndeterminate();
    }
    if (
      changed.has('checked') ||
      changed.has('value') ||
      changed.has('required') ||
      changed.has('error') ||
      changed.has('disabled') ||
      changed.has('name')
    ) {
      this.#sync();
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.requestUpdate();
  }

  formResetCallback(): void {
    this.#touched = false;
    this.checked = this.#defaultChecked;
    this.indeterminate = false;
    this.error = '';
    this.invalid = false;
  }

  #applyIndeterminate(): void {
    if (this.#control) {
      this.#control.indeterminate = this.indeterminate;
    }
  }

  #sync(): void {
    setFormValue(this.#internals, this.name && this.checked ? this.value : null);
    const missing = this.required && !this.checked;
    const message = this.error || (missing ? 'Please check this box.' : '');
    if (message) {
      const flags: ValidityStateFlags = this.error
        ? { customError: true }
        : { valueMissing: true };
      setValidity(this.#internals, flags, message, this.#control);
      this.invalid = Boolean(this.error) || this.#touched;
    } else {
      clearValidity(this.#internals);
      this.invalid = false;
    }
  }

  #onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.#touched = true;
    this.checked = target.checked;
    this.indeterminate = false;
    this.dispatchEvent(
      new CustomEvent('mb-change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    const describedBy = this.error ? 'error' : '';

    return html`
      <label part="label">
        <input
          part="control"
          type="checkbox"
          .checked=${this.checked}
          name=${this.name || nothing}
          value=${this.value}
          ?disabled=${this.#isDisabled}
          ?required=${this.required}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-describedby=${describedBy || nothing}
          @change=${this.#onChange}
        />
        <span>${this.label}<slot></slot></span>
      </label>
      ${this.error
        ? html`<p id="error" class="error" role="alert">${this.error}</p>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-checkbox': MbCheckbox;
  }
}

safeDefine('mb-checkbox', MbCheckbox);
