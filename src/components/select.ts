import { LitElement, html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { setFormValue } from '../lib/form.js';
import { FormFieldController } from '../lib/form-field.js';
import { jsonArrayConverter, parseJsonArrayAttribute } from '../lib/json-attr.js';
import { safeDefine } from '../lib/safe-define.js';
import { fieldLabelState, fieldStyles, sharedStyles } from '../lib/styles.js';

export type SelectOption = { value: string; label: string; disabled?: boolean };

function parseOptionsAttribute(value: string | null): SelectOption[] {
  return parseJsonArrayAttribute(
    value,
    (item): item is SelectOption =>
      Boolean(item) &&
      typeof item === 'object' &&
      typeof (item as SelectOption).value === 'string' &&
      typeof (item as SelectOption).label === 'string',
    (item) => ({
      value: item.value,
      label: item.label,
      disabled: Boolean(item.disabled),
    }),
  );
}

export class MbSelect extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    fieldStyles,
    css`
      /* Options are mirrored into the shadow <select>; keep light-DOM slots invisible. */
      slot {
        display: none;
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

  @property({ reflect: true })
  density: 'default' | 'compact' = 'default';

  @property({ type: Boolean, reflect: true, attribute: 'hide-label' })
  hideLabel = false;

  /** Visible label for the empty `value=""` option (filters: « Tous », « Aller à… »). */
  @property()
  placeholder = '';

  @property({ attribute: 'missing-message' })
  missingMessage = 'Please select an option.';

  @property({ attribute: 'invalid-message' })
  invalidMessage = 'Please select a valid option.';

  /**
   * Options as a JS property or JSON attribute:
   * `options='[{"value":"ok","label":"OK"}]'`
   * Slotted light-DOM `<option>` elements take precedence when present.
   */
  @property({
    attribute: 'options',
    converter: jsonArrayConverter(parseOptionsAttribute),
  })
  options: SelectOption[] = [];

  @state()
  private _slottedOptions: SelectOption[] = [];

  #field = new FormFieldController<string>(this);
  #control?: HTMLSelectElement;

  get #isDisabled(): boolean {
    return this.#field.isDisabled;
  }

  get #effectiveOptions(): SelectOption[] {
    return this._slottedOptions.length ? this._slottedOptions : this.options;
  }

  /** Non-empty options rendered after the placeholder option. */
  get #choiceOptions(): SelectOption[] {
    return this.#effectiveOptions.filter((opt) => opt.value !== '');
  }

  get #emptyLabel(): string {
    const slottedEmpty = this.#effectiveOptions.find((opt) => opt.value === '');
    if (slottedEmpty?.label) return slottedEmpty.label;
    return this.placeholder;
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
    // Prefer light-DOM options before first render (SSR / Go templates).
    this.#ingestLightDomOptions();
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
      changed.has('_slottedOptions') ||
      changed.has('disabled') ||
      changed.has('name') ||
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

  #optionFromElement(node: Element): SelectOption | null {
    if (!(node instanceof HTMLOptionElement)) return null;
    return {
      value: node.value,
      label: node.label || node.textContent?.trim() || node.value,
      disabled: node.disabled,
    };
  }

  #ingestLightDomOptions(): void {
    const options = [...this.querySelectorAll(':scope > option')]
      .map((node) => this.#optionFromElement(node))
      .filter((opt): opt is SelectOption => opt != null);
    if (options.length) {
      this._slottedOptions = options;
    }
  }

  #readSlottedOptions(): void {
    const slot = this.renderRoot.querySelector('slot[name="options"]') as HTMLSlotElement | null;
    // Also accept unnamed slotted <option> for ergonomic SSR:
    // <mb-select><option value="a">A</option></mb-select>
    const defaultSlot = this.renderRoot.querySelector('slot:not([name])') as HTMLSlotElement | null;
    const nodes = [
      ...(slot?.assignedElements({ flatten: true }) ?? []),
      ...(defaultSlot?.assignedElements({ flatten: true }) ?? []),
    ];
    const options = nodes
      .map((node) => this.#optionFromElement(node))
      .filter((opt): opt is SelectOption => opt != null);
    const prev = JSON.stringify(this._slottedOptions);
    const next = JSON.stringify(options);
    if (prev !== next) {
      this._slottedOptions = options;
    }
  }

  #onSlotChange(): void {
    this.#readSlottedOptions();
  }

  #sync(): void {
    if (this.#control && this.#control.value !== this.value) {
      this.#control.value = this.value;
    }
    const validChoice =
      !this.value ||
      this.#effectiveOptions.some(
        (option) => option.value === this.value && !option.disabled,
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
      this.#control,
      this.missingMessage,
      invalidChoice
        ? { flags: { badInput: true }, message: this.invalidMessage }
        : null,
    );
  }

  #onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
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
        <select
          id="control"
          part="control"
          class="control"
          name=${this.name || nothing}
          ?disabled=${this.#isDisabled}
          ?required=${this.required}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-label=${controlAriaLabel || nothing}
          aria-describedby=${describedBy || nothing}
          .value=${this.value}
          @change=${this.#onChange}
        >
          <option value="" ?disabled=${this.required}>${this.#emptyLabel}</option>
          ${repeat(
            this.#choiceOptions,
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
      <slot name="options" @slotchange=${this.#onSlotChange}></slot>
      <slot @slotchange=${this.#onSlotChange}></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mb-select': MbSelect;
  }
}

safeDefine('mb-select', MbSelect);
