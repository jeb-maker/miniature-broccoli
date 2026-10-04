import { LitElement, html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { setFormValue } from '../lib/form.js';
import { FormFieldController } from '../lib/form-field.js';
import { jsonArrayConverter, parseJsonArrayAttribute } from '../lib/json-attr.js';
import { safeDefine } from '../lib/safe-define.js';
import { fieldLabelState, fieldStyles, sharedStyles } from '../lib/styles.js';

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  href?: string;
};

export type ComboboxType = 'text' | 'search';

type FlatOption = ComboboxOption & { id: string; index: number };

function parseOptionsAttribute(value: string | null): ComboboxOption[] {
  return parseJsonArrayAttribute(
    value,
    (item): item is ComboboxOption =>
      Boolean(item) &&
      typeof item === 'object' &&
      typeof (item as ComboboxOption).value === 'string' &&
      typeof (item as ComboboxOption).label === 'string',
    (item) => ({
      value: item.value,
      label: item.label,
      disabled: Boolean(item.disabled),
      group: typeof item.group === 'string' ? item.group : undefined,
      href: typeof item.href === 'string' ? item.href : undefined,
    }),
  );
}

/**
 * Typeahead / search suggestions over a text field.
 * Hosts drive async filtering via `mb-input` + `.options` / `loading`.
 */
export class MbCombobox extends LitElement {
  static formAssociated = true;
  static override styles = [
    sharedStyles,
    fieldStyles,
    css`
      :host {
        position: relative;
      }

      .wrap {
        position: relative;
        inline-size: 100%;
      }

      .panel {
        position: absolute;
        inset-inline: 0;
        top: calc(100% + var(--mb-space-1, 0.25rem));
        z-index: 40;
        margin: 0;
        padding: var(--mb-space-1, 0.25rem);
        list-style: none;
        border: 1px solid var(--mb-color-border-strong);
        border-radius: var(--mb-radius-md);
        background: var(--mb-color-surface);
        color: var(--mb-color-fg);
        box-shadow: var(--mb-shadow);
        max-block-size: min(18rem, 50vh);
        overflow: auto;
      }

      .group {
        padding-block: var(--mb-space-2, 0.5rem) var(--mb-space-1, 0.25rem);
        padding-inline: var(--mb-space-3, 0.75rem);
        font-size: var(--mb-font-size-sm);
        font-weight: 600;
        color: var(--mb-color-muted);
        line-height: var(--mb-line-height-tight);
      }

      .option {
        display: block;
        inline-size: 100%;
        margin: 0;
        padding-block: var(--mb-space-2, 0.5rem);
        padding-inline: var(--mb-space-3, 0.75rem);
        border: 0;
        border-radius: var(--mb-radius-sm);
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: start;
        cursor: pointer;
        text-decoration: none;
        line-height: var(--mb-line-height-tight);
      }

      .option:hover:not([aria-disabled='true']),
      .option[data-active]:not([aria-disabled='true']) {
        background: var(--mb-color-hover);
      }

      .option[aria-disabled='true'] {
        color: var(--mb-color-muted);
        cursor: not-allowed;
      }

      .status {
        display: flex;
        align-items: center;
        gap: var(--mb-space-2, 0.5rem);
        padding-block: var(--mb-space-3, 0.75rem);
        padding-inline: var(--mb-space-3, 0.75rem);
        color: var(--mb-color-muted);
        font-size: var(--mb-font-size-sm);
        line-height: var(--mb-line-height-tight);
      }

      .spinner {
        flex-shrink: 0;
        inline-size: 0.9rem;
        block-size: 0.9rem;
        border: 2px solid var(--mb-color-border);
        border-inline-end-color: var(--mb-color-accent);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Options are mirrored into the shadow listbox; keep light-DOM slots invisible. */
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

  @property()
  placeholder = '';

  @property({ reflect: true })
  type: ComboboxType = 'search';

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

  /** Whether the suggestions panel is open. */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Show an indeterminate loading row in the panel. */
  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({
    attribute: 'options',
    converter: jsonArrayConverter(parseOptionsAttribute),
  })
  options: ComboboxOption[] = [];

  @property({ attribute: 'empty-message' })
  emptyMessage = 'No results';

  @property({ attribute: 'loading-message' })
  loadingMessage = 'Loading…';

  /** Close the panel after a selection (default true). */
  @property({ type: Boolean, attribute: 'close-on-select' })
  closeOnSelect = true;

  /** Close on outside click / blur (default true). */
  @property({ type: Boolean, attribute: 'close-on-blur' })
  closeOnBlur = true;

  @property({ attribute: 'missing-message' })
  missingMessage = 'Please fill out this field.';

  @property({ attribute: 'invalid-message' })
  invalidMessage = 'Please enter a valid value.';

  @state()
  private _slottedOptions: ComboboxOption[] = [];

  @state()
  private _activeIndex = -1;

  #field = new FormFieldController<string>(this);
  #input?: HTMLInputElement;
  #listboxId = `mb-combobox-list-${Math.random().toString(36).slice(2, 9)}`;
  #blurCloseTimer = 0;
  #ignoreBlurClose = false;

  get #isDisabled(): boolean {
    return this.#field.isDisabled;
  }

  get #ariaLabel(): string {
    return this.getAttribute('aria-label') ?? '';
  }

  get #effectiveOptions(): ComboboxOption[] {
    return this._slottedOptions.length ? this._slottedOptions : this.options;
  }

  get #flatOptions(): FlatOption[] {
    return this.#effectiveOptions.map((opt, index) => ({
      ...opt,
      index,
      id: `${this.#listboxId}-opt-${index}`,
    }));
  }

  get #enabledIndexes(): number[] {
    return this.#flatOptions
      .filter((opt) => !opt.disabled)
      .map((opt) => opt.index);
  }

  get #activeOption(): FlatOption | undefined {
    return this.#flatOptions[this._activeIndex];
  }

  get #showPanel(): boolean {
    return this.open && !this.#isDisabled;
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
    this.#ingestLightDomOptions();
    document.addEventListener('pointerdown', this.#onDocumentPointerDown, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this.#onDocumentPointerDown, true);
    window.clearTimeout(this.#blurCloseTimer);
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
      changed.has('missingMessage') ||
      changed.has('invalidMessage')
    ) {
      this.#sync();
    }

    if (changed.has('options') || changed.has('_slottedOptions') || changed.has('loading')) {
      if (this.open) {
        this.#clampActiveIndex();
      }
    }

    if (changed.has('open') && this.open) {
      this.#clampActiveIndex();
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
    this.open = false;
    this._activeIndex = -1;
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

  #optionFromElement(node: Element): ComboboxOption | null {
    if (!(node instanceof HTMLOptionElement)) return null;
    const group = node.getAttribute('data-group') || undefined;
    const href = node.getAttribute('data-href') || undefined;
    return {
      value: node.value,
      label: node.label || node.textContent?.trim() || node.value,
      disabled: node.disabled,
      group: group || undefined,
      href: href || undefined,
    };
  }

  #ingestLightDomOptions(): void {
    const options = [...this.querySelectorAll(':scope > option')]
      .map((node) => this.#optionFromElement(node))
      .filter((opt): opt is ComboboxOption => opt != null);
    if (options.length) {
      this._slottedOptions = options;
    }
  }

  #readSlottedOptions(): void {
    const slot = this.renderRoot.querySelector('slot[name="options"]') as HTMLSlotElement | null;
    const defaultSlot = this.renderRoot.querySelector('slot:not([name])') as HTMLSlotElement | null;
    const nodes = [
      ...(slot?.assignedElements({ flatten: true }) ?? []),
      ...(defaultSlot?.assignedElements({ flatten: true }) ?? []),
    ];
    const options = nodes
      .map((node) => this.#optionFromElement(node))
      .filter((opt): opt is ComboboxOption => opt != null);
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
    setFormValue(this.#field.internals, this.name ? this.value : null);
    const missing = this.required && !this.value;
    this.invalid = this.#field.applyNativeOrConstraintValidity(
      this.error,
      missing,
      this.#input,
      this.missingMessage,
      this.invalidMessage,
    );
  }

  #clampActiveIndex(): void {
    const enabled = this.#enabledIndexes;
    if (!enabled.length) {
      this._activeIndex = -1;
      return;
    }
    if (!enabled.includes(this._activeIndex)) {
      this._activeIndex = enabled[0]!;
    }
  }

  #moveActive(delta: number): void {
    const enabled = this.#enabledIndexes;
    if (!enabled.length) {
      this._activeIndex = -1;
      return;
    }
    const currentPos = enabled.indexOf(this._activeIndex);
    let nextPos: number;
    if (currentPos === -1) {
      nextPos = delta > 0 ? 0 : enabled.length - 1;
    } else {
      nextPos = (currentPos + delta + enabled.length) % enabled.length;
    }
    this._activeIndex = enabled[nextPos]!;
    this.#scrollActiveIntoView();
  }

  #jumpActive(to: 'start' | 'end'): void {
    const enabled = this.#enabledIndexes;
    if (!enabled.length) {
      this._activeIndex = -1;
      return;
    }
    this._activeIndex = to === 'start' ? enabled[0]! : enabled[enabled.length - 1]!;
    this.#scrollActiveIntoView();
  }

  #scrollActiveIntoView(): void {
    const active = this.#activeOption;
    if (!active) return;
    const el = this.renderRoot.querySelector(`#${CSS.escape(active.id)}`);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }

  #openPanel(): void {
    if (this.#isDisabled) return;
    this.open = true;
    this.#clampActiveIndex();
  }

  #closePanel(): void {
    this.open = false;
    this._activeIndex = -1;
  }

  #selectOption(option: ComboboxOption): void {
    if (option.disabled) return;
    this.#field.markTouched();
    this.value = option.label;
    this.#sync();
    this.dispatchEvent(
      new CustomEvent('mb-select', {
        detail: {
          value: option.value,
          label: option.label,
          href: option.href,
        },
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
    if (this.closeOnSelect) {
      this.#closePanel();
    }
  }

  #onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.#field.markTouched();
    this.value = target.value;
    this.#sync();
    this.#openPanel();
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

  #onFocus(): void {
    window.clearTimeout(this.#blurCloseTimer);
    if (this.loading || this.#effectiveOptions.length) {
      this.#openPanel();
    }
  }

  #onBlur(): void {
    if (!this.closeOnBlur || this.#ignoreBlurClose) return;
    window.clearTimeout(this.#blurCloseTimer);
    this.#blurCloseTimer = window.setTimeout(() => {
      if (!this.matches(':focus-within')) {
        this.#closePanel();
      }
    }, 0);
  }

  #onDocumentPointerDown = (event: Event): void => {
    if (!this.open || !this.closeOnBlur) return;
    const path = event.composedPath();
    if (!path.includes(this)) {
      this.#closePanel();
    }
  };

  #onKeyDown(event: KeyboardEvent): void {
    if (this.#isDisabled) return;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!this.open) {
          this.#openPanel();
        } else {
          this.#moveActive(1);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.open) {
          this.#openPanel();
        } else {
          this.#moveActive(-1);
        }
        break;
      }
      case 'Home': {
        if (this.open) {
          event.preventDefault();
          this.#jumpActive('start');
        }
        break;
      }
      case 'End': {
        if (this.open) {
          event.preventDefault();
          this.#jumpActive('end');
        }
        break;
      }
      case 'Enter': {
        if (this.open && this.#activeOption) {
          event.preventDefault();
          this.#selectOption(this.#activeOption);
        }
        break;
      }
      case 'Escape': {
        if (this.open) {
          event.preventDefault();
          this.#closePanel();
        }
        break;
      }
      default:
        break;
    }
  }

  #onOptionPointerDown(event: Event): void {
    // Keep focus on the input so blur does not race the click.
    event.preventDefault();
    this.#ignoreBlurClose = true;
  }

  #onOptionClick(option: ComboboxOption): void {
    this.#ignoreBlurClose = false;
    this.#selectOption(option);
    this.#input?.focus();
  }

  #renderGroupedOptions() {
    const flat = this.#flatOptions;
    const blocks: Array<{ group?: string; items: FlatOption[] }> = [];
    for (const opt of flat) {
      const last = blocks[blocks.length - 1];
      if (last && last.group === opt.group) {
        last.items.push(opt);
      } else {
        blocks.push({ group: opt.group, items: [opt] });
      }
    }

    return repeat(
      blocks,
      (block, i) => `${block.group ?? ''}::${i}`,
      (block) => html`
        ${block.group
          ? html`<div class="group" role="presentation">${block.group}</div>`
          : nothing}
        ${repeat(
          block.items,
          (opt) => opt.id,
          (opt) => html`
            <div
              id=${opt.id}
              class="option"
              part="option"
              role="option"
              tabindex="-1"
              ?data-active=${opt.index === this._activeIndex}
              aria-selected=${opt.index === this._activeIndex ? 'true' : 'false'}
              aria-disabled=${opt.disabled ? 'true' : 'false'}
              @pointerdown=${this.#onOptionPointerDown}
              @click=${() => this.#onOptionClick(opt)}
            >
              ${opt.label}
            </div>
          `,
        )}
      `,
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
    const active = this.#activeOption;
    const showEmpty = this.#showPanel && !this.loading && this.#flatOptions.length === 0;
    const showOptions = this.#showPanel && this.#flatOptions.length > 0;

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
        <div class="wrap">
          <input
            id="control"
            part="control"
            class="control"
            role="combobox"
            .type=${this.type}
            .value=${this.value}
            name=${this.name || nothing}
            placeholder=${this.placeholder || nothing}
            autocomplete="off"
            ?disabled=${this.#isDisabled}
            ?required=${this.required}
            aria-invalid=${this.invalid ? 'true' : 'false'}
            aria-label=${controlAriaLabel || nothing}
            aria-describedby=${describedBy || nothing}
            aria-expanded=${this.#showPanel ? 'true' : 'false'}
            aria-controls=${this.#listboxId}
            aria-autocomplete="list"
            aria-activedescendant=${this.#showPanel && active ? active.id : nothing}
            @input=${this.#onInput}
            @change=${this.#onChange}
            @focus=${this.#onFocus}
            @blur=${this.#onBlur}
            @keydown=${this.#onKeyDown}
          />
          ${this.#showPanel
            ? html`
                <div
                  id=${this.#listboxId}
                  class="panel"
                  part="panel"
                  role="listbox"
                  aria-label=${labelText || controlAriaLabel || 'Suggestions'}
                >
                  ${this.loading
                    ? html`
                        <div class="status" part="status" role="status" aria-live="polite">
                          <span class="spinner" aria-hidden="true"></span>
                          <span>${this.loadingMessage}</span>
                        </div>
                      `
                    : nothing}
                  ${showOptions ? this.#renderGroupedOptions() : nothing}
                  ${showEmpty
                    ? html`
                        <div class="status" part="empty" role="status" aria-live="polite">
                          ${this.emptyMessage}
                        </div>
                      `
                    : nothing}
                </div>
              `
            : nothing}
        </div>
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
    'mb-combobox': MbCombobox;
  }
}

safeDefine('mb-combobox', MbCombobox);
