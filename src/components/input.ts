import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { clearValidity, setFormValue, setValidity } from '../lib/form.js';
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

  @property({ reflect: true })
  type: InputType = 'text';

  @property()
  value = '';

  @property({ reflect: true })
  name = '';

  @property()
  placeholder = '';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  #internals = this.attachInternals();
  #formDisabled = false;
  #input?: HTMLInputElement;

  get #isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
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
      changed.has('disabled')
    ) {
      this.#sync();
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.requestUpdate();
  }

  formResetCallback(): void {
    this.value = '';
    this.error = '';
    this.invalid = false;
  }

  #sync(): void {
    setFormValue(this.#internals, this.name ? this.value : this.value);
    const missing = this.required && !this.value;
    const message = this.error || (missing ? 'Please fill out this field.' : '');
    if (message) {
      this.invalid = true;
      setValidity(this.#internals, { customError: true, valueMissing: missing }, message, this.#input);
    } else {
      this.invalid = false;
      clearValidity(this.#internals);
    }
  }

  #onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('mb-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent('mb-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    const describedBy = [this.hint ? 'hint' : '', this.error ? 'error' : '']
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
