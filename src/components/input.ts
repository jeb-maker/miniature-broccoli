import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { clearValidity, constraintFlags, setFormValue, setValidity } from '../lib/form.js';
import { safeDefine } from '../lib/safe-define.js';
import { fieldLabelState, fieldStyles, sharedStyles } from '../lib/styles.js';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'url'
  | 'tel'
  | 'number'
  | 'file';

export class MbInput extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    fieldStyles,
    css`
      :host {
        display: block;
      }

      input[type='file'].control {
        padding-block: var(--mb-space-2);
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

  @property({ reflect: true })
  density: 'default' | 'compact' = 'default';

  @property({ type: Boolean, reflect: true, attribute: 'hide-label' })
  hideLabel = false;

  @property()
  min = '';

  @property()
  max = '';

  @property()
  step = '';

  @property()
  accept = '';

  @property({ type: Boolean })
  multiple = false;

  #internals = this.attachInternals();
  #formDisabled = false;
  #input?: HTMLInputElement;
  #defaultValue = '';
  #defaultCaptured = false;
  #touched = false;

  get #isDisabled(): boolean {
    return this.disabled || this.#formDisabled;
  }

  get #isFile(): boolean {
    return this.type === 'file';
  }

  get #ariaLabel(): string {
    return this.getAttribute('aria-label') ?? '';
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
      changed.has('name') ||
      changed.has('type')
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
    if (this.#isFile && this.#input) {
      this.#input.value = '';
    }
  }

  #syncFileValue(): void {
    const files = this.#input?.files;
    if (!this.name || !files?.length) {
      setFormValue(this.#internals, null);
      return;
    }
    if (files.length === 1) {
      setFormValue(this.#internals, files[0]);
      return;
    }
    const data = new FormData();
    for (const file of files) {
      data.append(this.name, file);
    }
    setFormValue(this.#internals, data);
  }

  #sync(): void {
    if (this.#isFile) {
      this.#syncFileValue();
    } else {
      setFormValue(this.#internals, this.name ? this.value : null);
    }
    const missing =
      this.required &&
      (this.#isFile ? !this.#input?.files?.length : !this.value);
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
    if (!this.#isFile) {
      this.value = target.value;
    }
    this.#sync();
    this.dispatchEvent(
      new CustomEvent('mb-input', {
        detail: { value: this.value, files: target.files },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.#touched = true;
    if (!this.#isFile) {
      this.value = target.value;
    }
    this.#sync();
    this.dispatchEvent(
      new CustomEvent('mb-change', {
        detail: { value: this.value, files: target.files },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.defaultPrevented || this.#isFile) return;
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
    const { labelText, hideVisually, controlAriaLabel } = fieldLabelState(
      this.label,
      this.hideLabel,
      this.#ariaLabel,
    );

    return html`
      <div class="field">
        ${labelText
          ? html`<label
              part="label"
              class="label${hideVisually ? ' visually-hidden' : ''}"
              for="control"
              >${labelText}</label
            >`
          : nothing}
        <input
          id="control"
          part="control"
          class="control"
          .type=${this.type}
          .value=${this.#isFile ? '' : this.value}
          name=${this.name || nothing}
          placeholder=${this.placeholder || nothing}
          min=${this.type === 'number' && this.min !== '' ? this.min : nothing}
          max=${this.type === 'number' && this.max !== '' ? this.max : nothing}
          step=${this.type === 'number' && this.step !== '' ? this.step : nothing}
          accept=${this.#isFile && this.accept ? this.accept : nothing}
          ?multiple=${this.#isFile && this.multiple}
          ?disabled=${this.#isDisabled}
          ?required=${this.required}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-label=${controlAriaLabel || nothing}
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
