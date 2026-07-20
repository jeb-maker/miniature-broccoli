import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { clearValidity, constraintFlags, setFormValue, setValidity } from '../lib/form.js';
import { safeDefine } from '../lib/safe-define.js';
import { fieldStyles, sharedStyles } from '../lib/styles.js';

export type SelectOption = { value: string; label: string; disabled?: boolean };

export class MbSelect extends LitElement {
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

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ attribute: false })
  options: SelectOption[] = [];

  #internals = this.attachInternals();
  #formDisabled = false;
  #control?: HTMLSelectElement;
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
    this.#control = this.renderRoot.querySelector('select') ?? undefined;
    this.#sync();
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has('value') ||
      changed.has('required') ||
      changed.has('error') ||
      changed.has('options') ||
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
    if (this.#control && this.#control.value !== this.value) {
      this.#control.value = this.value;
    }
    setFormValue(this.#internals, this.name ? this.value : null);
    const missing = this.required && !this.value;
    const { flags, message } = constraintFlags(
      this.error,
      missing,
      'Please select an option.',
    );
    if (message) {
      setValidity(this.#internals, flags, message, this.#control);
      this.invalid = Boolean(this.error) || this.#touched;
    } else {
      clearValidity(this.#internals);
      this.invalid = false;
    }
  }

  #onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
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

  override render() {
    const describedBy = [this.hint && !this.error ? 'hint' : '', this.error ? 'error' : '']
      .filter(Boolean)
      .join(' ');

    return html`
      <div class="field">
        ${this.label
          ? html`<label part="label" class="label" for="control">${this.label}</label>`
          : nothing}
        <select
          id="control"
          part="control"
          class="control"
          name=${this.name || nothing}
          ?disabled=${this.#isDisabled}
          ?required=${this.required}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-describedby=${describedBy || nothing}
          .value=${this.value}
          @change=${this.#onChange}
        >
          <option value="" ?disabled=${this.required}></option>
          ${repeat(
            this.options,
            (opt) => opt.value,
            (opt) => html`
              <option value=${opt.value} ?disabled=${Boolean(opt.disabled)}>
                ${opt.label}
              </option>
            `,
          )}
        </select>
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
    'mb-select': MbSelect;
  }
}

safeDefine('mb-select', MbSelect);
