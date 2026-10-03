import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { setFormValue } from '../lib/form.js';
import { FormFieldController } from '../lib/form-field.js';
import { jsonArrayConverter, parseJsonArrayAttribute } from '../lib/json-attr.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';
import type { MbRadio } from './radio.js';
import './radio.js';

export type RadioOption = { value: string; label: string; disabled?: boolean };

function parseOptionsAttribute(value: string | null): RadioOption[] {
  return parseJsonArrayAttribute(
    value,
    (item): item is RadioOption =>
      Boolean(item) &&
      typeof item === 'object' &&
      typeof (item as RadioOption).value === 'string' &&
      typeof (item as RadioOption).label === 'string',
    (item) => ({
      value: item.value,
      label: item.label,
      disabled: Boolean(item.disabled),
    }),
  );
}

export class MbRadioGroup extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        inline-size: 100%;
      }

      fieldset {
        margin: 0;
        padding: 0;
        border: 0;
        min-inline-size: 0;
      }

      legend {
        font-size: var(--mb-font-size-sm);
        font-weight: 600;
        margin-block-end: var(--mb-space-2);
      }

      .options {
        display: flex;
        flex-direction: column;
        gap: var(--mb-space-3);
      }

      .error {
        margin: var(--mb-space-2) 0 0;
        color: var(--mb-color-danger);
        font-size: var(--mb-font-size-sm);
      }
    `,
  ];

  @property()
  label = '';

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

  @property({ attribute: 'missing-message' })
  missingMessage = 'Please select an option.';

  @property({ attribute: 'invalid-message' })
  invalidMessage = 'Please select a valid option.';

  @property({
    attribute: 'options',
    converter: jsonArrayConverter(parseOptionsAttribute),
  })
  options: RadioOption[] = [];

  #field = new FormFieldController<string>(this);
  /** Author `disabled` on slotted radios, captured before the group forces disable. */
  #slottedDisabled = new WeakMap<MbRadio, boolean>();

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
    this.#field.captureDefault(this.value);
    this.addEventListener('mb-radio-select', this.#onRadioSelect as EventListener);
    this.addEventListener('keydown', this.#onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mb-radio-select', this.#onRadioSelect as EventListener);
    this.removeEventListener('keydown', this.#onKeyDown);
  }

  override firstUpdated(): void {
    this.#syncRadios();
    this.#sync();
  }

  override updated(changed: Map<string, unknown>): void {
    if (
      changed.has('value') ||
      changed.has('name') ||
      changed.has('disabled') ||
      changed.has('options')
    ) {
      this.#syncRadios();
    }
    if (
      changed.has('value') ||
      changed.has('required') ||
      changed.has('error') ||
      changed.has('name') ||
      changed.has('disabled') ||
      changed.has('missingMessage') ||
      changed.has('invalidMessage')
    ) {
      this.#sync();
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.#field.formDisabledCallback(disabled);
    this.#syncRadios();
  }

  formResetCallback(): void {
    this.#field.resetInteraction();
    this.value = this.#field.defaultValue;
    this.error = '';
    this.invalid = false;
    this.#syncRadios();
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

  #slottedRadios(): MbRadio[] {
    return (
      this.renderRoot
        .querySelector('slot')
        ?.assignedElements({ flatten: true })
        .filter((el): el is MbRadio => el.localName === 'mb-radio') ?? []
    );
  }

  #radios(): MbRadio[] {
    const generated = [
      ...this.renderRoot.querySelectorAll<MbRadio>('.options > mb-radio'),
    ];
    return [...this.#slottedRadios(), ...generated];
  }

  #syncRadios(): void {
    const radios = this.#radios();
    for (const radio of radios) {
      radio.name = this.name || 'mb-radio-group';
      radio.checked = radio.value === this.value;
    }

    // JSON `options` radios get `disabled` from the Lit template. Slotted radios
    // need an explicit restore so group re-enable does not leave them stuck.
    for (const radio of this.#slottedRadios()) {
      if (!this.#slottedDisabled.has(radio)) {
        this.#slottedDisabled.set(radio, radio.disabled);
      }
      radio.disabled = this.#isDisabled || Boolean(this.#slottedDisabled.get(radio));
    }
  }

  #sync(): void {
    const validChoice =
      !this.value ||
      this.#radios().some(
        (radio) =>
          radio.value === this.value &&
          (!radio.disabled || this.#isDisabled),
      );
    setFormValue(
      this.#field.internals,
      this.name && validChoice ? this.value : null,
    );
    const missing = this.required && !this.value;
    const invalidChoice = Boolean(this.value) && !validChoice;
    this.invalid = this.#field.applyConstraintValidity(
      this.error,
      missing,
      undefined,
      this.missingMessage,
      invalidChoice
        ? { flags: { badInput: true }, message: this.invalidMessage }
        : null,
    );
  }

  #onRadioSelect = (event: Event): void => {
    const value = (event as CustomEvent<{ value: string }>).detail?.value;
    if (value == null) return;
    this.#field.markTouched();
    this.value = value;
    this.#syncRadios();
    this.#sync();
    this.dispatchEvent(
      new CustomEvent('mb-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    const radios = this.#radios().filter((r) => !r.disabled);
    if (!radios.length) return;
    event.preventDefault();
    const current = radios.findIndex((r) => r.value === this.value);
    const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const next = radios[(current + delta + radios.length) % radios.length];
    this.#field.markTouched();
    this.value = next.value;
    this.#syncRadios();
    this.#sync();
    next.focus();
    this.dispatchEvent(
      new CustomEvent('mb-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #onSlotChange(): void {
    this.#syncRadios();
  }

  override render() {
    return html`
      <fieldset part="fieldset" ?disabled=${this.#isDisabled}>
        ${this.label ? html`<legend part="legend">${this.label}</legend>` : nothing}
        <div class="options" part="options" role="radiogroup" aria-invalid=${this.invalid ? 'true' : 'false'}>
          <slot @slotchange=${this.#onSlotChange}></slot>
          ${this.options.map(
            (opt) => html`
              <mb-radio
                .value=${opt.value}
                .label=${opt.label}
                ?disabled=${Boolean(opt.disabled) || this.#isDisabled}
                ?checked=${opt.value === this.value}
                .name=${this.name || 'mb-radio-group'}
              ></mb-radio>
            `,
          )}
        </div>
        ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-radio-group': MbRadioGroup;
  }
}

safeDefine('mb-radio-group', MbRadioGroup);
