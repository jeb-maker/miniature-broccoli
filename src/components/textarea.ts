import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { setFormValue } from '../lib/form.js';
import { FormFieldController } from '../lib/form-field.js';
import { safeDefine } from '../lib/safe-define.js';
import { fieldLabelState, fieldStyles, sharedStyles } from '../lib/styles.js';

export class MbTextarea extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    fieldStyles,
    css`
      textarea.control {
        block-size: auto;
        min-block-size: 6rem;
        padding-block: var(--mb-space-2, 0.5rem);
        line-height: var(--mb-line-height, 1.5);
        /* Full-width block; not user-resizable unless hosts opt in later. */
        resize: none;
        field-sizing: fixed;
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

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ type: Number })
  rows = 4;

  @property({ reflect: true })
  density: 'default' | 'compact' = 'default';

  @property({ type: Boolean, reflect: true, attribute: 'hide-label' })
  hideLabel = false;

  @property({ type: Number, attribute: 'maxlength' })
  maxLength: number | null = null;

  @property({ type: Number, attribute: 'minlength' })
  minLength: number | null = null;

  @property()
  autocomplete = '';

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ attribute: 'missing-message' })
  missingMessage = 'Please fill out this field.';

  @property({ attribute: 'invalid-message' })
  invalidMessage = 'Please enter a valid value.';

  #field = new FormFieldController<string>(this);
  #control?: HTMLTextAreaElement;

  get #isDisabled(): boolean {
    return this.#field.isDisabled;
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
    this.#control = this.renderRoot.querySelector('textarea') ?? undefined;
    this.#sync();
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has('value') ||
      changed.has('required') ||
      changed.has('error') ||
      changed.has('disabled') ||
      changed.has('name') ||
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
    this.#sync();
  }

  formStateRestoreCallback(
    state: string | File | FormData | null,
    _mode: 'restore' | 'autocomplete',
  ): void {
    if (typeof state === 'string') {
      this.value = state;
    }
  }

  #sync(): void {
    setFormValue(this.#field.internals, this.name ? this.value : null);
    const missing = this.required && !this.value;
    this.invalid = this.#field.applyNativeOrConstraintValidity(
      this.error,
      missing,
      this.#control,
      this.missingMessage,
      this.invalidMessage,
    );
  }

  #onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.#field.markTouched();
    this.value = target.value;
    this.#sync();
    this.dispatchEvent(
      new CustomEvent('mb-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.#field.markTouched();
    this.value = target.value;
    this.#sync();
    this.dispatchEvent(
      new CustomEvent('mb-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
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
        <textarea
          id="control"
          part="control"
          class="control"
          .value=${this.value}
          name=${this.name || nothing}
          placeholder=${this.placeholder || nothing}
          rows=${this.rows}
          maxlength=${this.maxLength != null ? this.maxLength : nothing}
          minlength=${this.minLength != null ? this.minLength : nothing}
          autocomplete=${this.autocomplete || nothing}
          ?readonly=${this.readonly}
          ?disabled=${this.#isDisabled}
          ?required=${this.required}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-label=${controlAriaLabel || nothing}
          aria-describedby=${describedBy || nothing}
          @input=${this.#onInput}
          @change=${this.#onChange}
        ></textarea>
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
    'mb-textarea': MbTextarea;
  }
}

safeDefine('mb-textarea', MbTextarea);
