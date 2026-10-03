import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { setFormValue } from '../lib/form.js';
import { FormFieldController } from '../lib/form-field.js';
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
        flex: none;
        margin-block-start: 0;
        accent-color: var(--mb-color-accent);
        inline-size: 1.5rem;
        block-size: 1.5rem;
      }

      input:disabled {
        cursor: not-allowed;
      }

      :host([invalid]) input {
        outline: 2px solid var(--mb-color-danger);
        outline-offset: 2px;
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

  @property({ attribute: 'missing-message' })
  missingMessage = 'Please check this box.';

  #field = new FormFieldController<boolean>(this);
  #control?: HTMLInputElement;

  get #isDisabled(): boolean {
    return this.#field.isDisabled;
  }

  checkValidity(): boolean {
    return this.#field.checkValidity();
  }

  reportValidity(): boolean {
    return this.#field.reportValidity();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#field.captureDefault(this.checked);
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
      changed.has('name') ||
      changed.has('missingMessage')
    ) {
      this.#sync();
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.#field.formDisabledCallback(disabled);
  }

  formResetCallback(): void {
    this.#field.resetInteraction();
    this.checked = this.#field.defaultValue;
    this.indeterminate = false;
    this.error = '';
    this.invalid = false;
    this.#sync();
  }

  formStateRestoreCallback(
    state: string | File | FormData | null,
    _mode: 'restore' | 'autocomplete',
  ): void {
    if (state == null) {
      this.checked = false;
      return;
    }
    if (typeof state === 'string') {
      this.checked = true;
      if (state) this.value = state;
    }
  }

  #applyIndeterminate(): void {
    if (this.#control) {
      this.#control.indeterminate = this.indeterminate;
    }
  }

  #sync(): void {
    setFormValue(this.#field.internals, this.name && this.checked ? this.value : null);
    const missing = this.required && !this.checked;
    this.invalid = this.#field.applyConstraintValidity(
      this.error,
      missing,
      this.#control,
      this.missingMessage,
    );
  }

  #onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.#field.markTouched();
    this.checked = target.checked;
    this.indeterminate = false;
    this.#sync();
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
