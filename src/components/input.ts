import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { clearValidity, constraintFlags, setFormValue, setValidity } from '../lib/form.js';
import { safeDefine } from '../lib/safe-define.js';
import { fieldStyles, sharedStyles } from '../lib/styles.js';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'url' | 'tel';

export class MbInput extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    fieldStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  @property()
  label = '';

  @property()
  hint = '';

  @property()
  error = '';

  @property()
  value = '';

  @property({ reflect: true })
  name = '';

  @property()
  placeholder = '';

  @property({ reflect: true })
  type: InputType = 'text';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  #internals = this.attachInternals();
  #formDisabled = false;
  #input?: HTMLInputElement;
  #defaultValue = '';
  #defaultCaptured = false;
  #touched = false;

  get #isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.#defaultCaptured) {
      this.#defaultValue = this.value;
      this.#defaultCaptured = true;
    }
  }

  override firstUpdated(): void {
    this.#input = this.renderRoot.querySelector('input') ?? undefined;
    this.#sync();
  }

  override updated(changed: Map<string, unknown>): void {
    if (
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
    this.value = this.#defaultValue;
    this.error = '';
    this.invalid = false;
  }

  #sync(): void {
    setFormValue(this.#internals, this.name ? this.value : null);
    const missing = this.required && !this.value;
    const { flags, message } = constraintFlags(this.error, missing);
    if (message) {
      setValidity(this.#internals, flags, message, this.#input);
      this.invalid = Boolean(this.error) || this.#touched;
    } else {
      clearValidity(this.#internals);
      this.invalid = false;
    }
  }

  #onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.#touched = true;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('mb-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.#touched = true;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('mb-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.defaultPrevented) return;
    const form = this.#internals.form;
    if (form) {
      event.preventDefault();
      form.requestSubmit();
    }
  }

  override render() {
    const describedBy = [this.hint && !this.error ? 'hint' : '', this.error ? 'error' : '']
      .filter(Boolean)
      .join(' ');

    return html`
      <div class="field">
        ${this.label
          ? html`<label part="label" class="label" for="control">${this.label}</label>`
          : nothing}
        <input
          id="control"
          part="control"
          class="control"
          .type=${this.type}
          .value=${this.value}
          name=${this.name || nothing}
          placeholder=${this.placeholder || nothing}
          ?disabled=${this.#isDisabled}
          ?required=${this.required}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-describedby=${describedBy || nothing}
          @input=${this.#onInput}
          @change=${this.#onChange}
          @keydown=${this.#onKeyDown}
        />
        ${this.hint && !this.error
          ? html`<p id="hint" class="hint">${this.hint}</p>`
          : nothing}
        ${this.error ? html`<p id="error" class="error" role="alert">${this.error}</p>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-input': MbInput;
  }
}

safeDefine('mb-input', MbInput);
