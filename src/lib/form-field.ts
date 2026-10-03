import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { clearValidity, constraintFlags, setValidity } from './form.js';

export type FormFieldHost = ReactiveControllerHost &
  HTMLElement & {
    disabled: boolean;
    requestUpdate(): void;
  };

/**
 * Shared FACE bookkeeping for form-associated Lit controls:
 * internals, fieldset disabled, default capture, touched, validity helpers.
 */
export class FormFieldController<TDefault> implements ReactiveController {
  readonly internals: ElementInternals;
  formDisabled = false;
  touched = false;
  defaultValue!: TDefault;
  #defaultCaptured = false;

  constructor(readonly host: FormFieldHost) {
    this.internals = host.attachInternals();
    host.addController(this);
  }

  hostConnected(): void {}

  get isDisabled(): boolean {
    return this.host.disabled || this.formDisabled;
  }

  captureDefault(value: TDefault): void {
    if (!this.#defaultCaptured) {
      this.defaultValue = value;
      this.#defaultCaptured = true;
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled;
    this.host.requestUpdate();
  }

  markTouched(): void {
    this.touched = true;
  }

  resetInteraction(): void {
    this.touched = false;
  }

  /**
   * Apply constraint / custom / optional extra flags. Sets `invalid` semantics:
   * show invalid when there is an author `error` or the control was touched.
   * Returns the resolved invalid flag for the host to assign.
   */
  applyConstraintValidity(
    error: string,
    missing: boolean,
    anchor?: HTMLElement,
    missingMessage?: string,
    extra?: { flags: ValidityStateFlags; message: string } | null,
  ): boolean {
    const constrained = constraintFlags(error, missing, missingMessage);
    const flags = error
      ? constrained.flags
      : extra?.flags
        ? extra.flags
        : constrained.flags;
    const message = error
      ? constrained.message
      : extra?.message
        ? extra.message
        : constrained.message;
    if (message) {
      setValidity(this.internals, flags, message, anchor);
      return Boolean(error) || this.touched;
    }
    clearValidity(this.internals);
    return false;
  }

  /** Merge native ValidityState into ElementInternals (text-like controls). */
  applyNativeOrConstraintValidity(
    error: string,
    missing: boolean,
    control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined,
    missingMessage?: string,
    invalidNativeFallback = 'Please enter a valid value.',
  ): boolean {
    const validity = control?.validity;
    const nativeFlags: ValidityStateFlags =
      validity && !validity.valid
        ? {
            badInput: validity.badInput,
            patternMismatch: validity.patternMismatch,
            rangeOverflow: validity.rangeOverflow,
            rangeUnderflow: validity.rangeUnderflow,
            stepMismatch: validity.stepMismatch,
            tooLong: validity.tooLong,
            tooShort: validity.tooShort,
            typeMismatch: validity.typeMismatch,
            valueMissing: validity.valueMissing,
          }
        : {};
    const constrained = constraintFlags(error, missing, missingMessage);
    const flags = error || missing ? constrained.flags : nativeFlags;
    const message =
      error || missing
        ? constrained.message
        : validity && !validity.valid
          ? control?.validationMessage || invalidNativeFallback
          : '';
    if (message) {
      setValidity(this.internals, flags, message, control);
      return Boolean(error) || this.touched;
    }
    clearValidity(this.internals);
    return false;
  }

  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.internals.reportValidity();
  }
}
