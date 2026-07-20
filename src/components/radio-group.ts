import { LitElement, html, css, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { clearValidity, constraintFlags, setFormValue, setValidity } from '../lib/form.js';
import { safeDefine } from '../lib/safe-define.js';
import { sharedStyles } from '../lib/styles.js';
import type { MbRadio } from './radio.js';
import './radio.js';

export type RadioOption = { value: string; label: string; disabled?: boolean };

function parseOptionsAttribute(value: string | null): RadioOption[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is RadioOption =>
          Boolean(item) &&
          typeof item === 'object' &&
          typeof (item as RadioOption).value === 'string' &&
          typeof (item as RadioOption).label === 'string',
      )
      .map((item) => ({
        value: item.value,
        label: item.label,
        disabled: Boolean(item.disabled),
      }));
  } catch {
    return [];
  }
}

export class MbRadioGroup extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
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
        gap: var(--mb-space-2);
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

  @property({
    attribute: 'options',
    converter: {
      fromAttribute: parseOptionsAttribute,
      toAttribute(value: RadioOption[]): string | null {
        return value?.length ? JSON.stringify(value) : null;
      },
    },
  })
  options: RadioOption[] = [];

  #internals = this.attachInternals();
  #formDisabled = false;
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
      changed.has('disabled')
    ) {
      this.#sync();
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.#formDisabled = disabled;
    this.requestUpdate();
    this.#syncRadios();
  }

  formResetCallback(): void {
    this.#touched = false;
    this.value = this.#defaultValue;
    this.error = '';
    this.invalid = false;
  }

  #radios(): MbRadio[] {
    const slotted =
      this.renderRoot
        .querySelector('slot')
        ?.assignedElements({ flatten: true })
        .filter((el): el is MbRadio => el.localName === 'mb-radio') ?? [];
    const generated = [
      ...this.renderRoot.querySelectorAll<MbRadio>('.options > mb-radio'),
    ];
    return [...slotted, ...generated];
  }

  #syncRadios(): void {
    const radios = this.#radios();
    for (const radio of radios) {
      radio.name = this.name || 'mb-radio-group';
      radio.checked = radio.value === this.value;
      if (this.#isDisabled) {
        radio.disabled = true;
      }
    }
  }

  #sync(): void {
    setFormValue(this.#internals, this.name ? this.value : null);
    const missing = this.required && !this.value;
    const { flags, message } = constraintFlags(
      this.error,
      missing,
      'Please select an option.',
    );
    if (message) {
      setValidity(this.#internals, flags, message);
      this.invalid = Boolean(this.error) || this.#touched;
    } else {
      clearValidity(this.#internals);
      this.invalid = false;
    }
  }

  #onRadioSelect = (event: Event): void => {
    const value = (event as CustomEvent<{ value: string }>).detail?.value;
    if (value == null) return;
    this.#touched = true;
    this.value = value;
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
    this.#touched = true;
    this.value = next.value;
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
