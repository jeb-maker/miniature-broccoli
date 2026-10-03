import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { setFormValue } from '../lib/form.js';
import { FormFieldController } from '../lib/form-field.js';
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
      input[type='file'].control {
        /* File controls need a little block padding for the UA button chrome. */
        padding-block: var(--mb-space-1, 0.25rem);
        line-height: 1.2;
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

  @property()
  pattern = '';

  @property({ type: Number, attribute: 'maxlength' })
  maxLength: number | null = null;

  @property({ type: Number, attribute: 'minlength' })
  minLength: number | null = null;

  @property()
  autocomplete = '';

  @property({ type: Boolean, reflect: true })
  readonly = false;

  /** Override for the required / valueMissing message (i18n). */
  @property({ attribute: 'missing-message' })
  missingMessage = 'Please fill out this field.';

  /** Fallback when native validity fails without a UA message. */
  @property({ attribute: 'invalid-message' })
  invalidMessage = 'Please enter a valid value.';

  #field = new FormFieldController<string>(this);
  #input?: HTMLInputElement;

  get #isDisabled(): boolean {
    return this.#field.isDisabled;
  }

  get #isFile(): boolean {
    return this.type === 'file';
  }

  get #ariaLabel(): string {
    return this.getAttribute('aria-label') ?? '';
  }

  checkValidity(): boolean {
    return this.#field.checkValidity();
  }

  reportValidity(): boolean {
    return this.#field.reportValidity();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#field.captureDefault(this.value);
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
      changed.has('type') ||
      changed.has('min') ||
      changed.has('max') ||
      changed.has('step') ||
      changed.has('multiple') ||
      changed.has('pattern') ||
      changed.has('maxLength') ||
      changed.has('minLength') ||
      changed.has('readonly') ||
      changed.has('missingMessage') ||
      changed.has('invalidMessage')
    ) {
      this.#sync();
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.#field.formDisabledCallback(disabled);
  }

  formResetCallback(): void {
    this.#field.resetInteraction();
    this.value = this.#field.defaultValue;
    this.error = '';
    this.invalid = false;
    if (this.#isFile && this.#input) {
      this.#input.value = '';
    }
  }

  formStateRestoreCallback(
    state: string | File | FormData | null,
    _mode: 'restore' | 'autocomplete',
  ): void {
    if (this.#isFile) return;
    if (typeof state === 'string') {
      this.value = state;
    }
  }

  #syncFileValue(): void {
    const files = this.#input?.files;
    if (!this.name || !files?.length) {
      setFormValue(this.#field.internals, null);
      return;
    }
    if (files.length === 1) {
      setFormValue(this.#field.internals, files[0]);
      return;
    }
    const data = new FormData();
    for (const file of files) {
      data.append(this.name, file);
    }
    setFormValue(this.#field.internals, data);
  }

  #sync(): void {
    if (this.#isFile) {
      this.#syncFileValue();
    } else {
      setFormValue(this.#field.internals, this.name ? this.value : null);
    }
    const missing =
      this.required &&
      (this.#isFile ? !this.#input?.files?.length : !this.value);
    this.invalid = this.#field.applyNativeOrConstraintValidity(
      this.error,
      missing,
      this.#input,
      this.missingMessage,
      this.invalidMessage,
    );
  }

  #onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.#field.markTouched();
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
    this.#field.markTouched();
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
    const form = this.#field.internals.form;
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
          pattern=${!this.#isFile && this.pattern ? this.pattern : nothing}
          maxlength=${!this.#isFile && this.maxLength != null ? this.maxLength : nothing}
          minlength=${!this.#isFile && this.minLength != null ? this.minLength : nothing}
          autocomplete=${!this.#isFile && this.autocomplete ? this.autocomplete : nothing}
          ?multiple=${this.#isFile && this.multiple}
          ?readonly=${!this.#isFile && this.readonly}
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
