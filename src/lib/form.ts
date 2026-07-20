export function setFormValue(
  internals: ElementInternals,
  value: string | File | FormData | null,
  state?: string | File | FormData | null,
): void {
  internals.setFormValue(value, state ?? value);
}

export function setValidity(
  internals: ElementInternals,
  flags: ValidityStateFlags,
  message = '',
  anchor?: HTMLElement,
): void {
  internals.setValidity(flags, message, anchor);
}

export function clearValidity(internals: ElementInternals): void {
  internals.setValidity({});
}

/** Build validity flags without marking customError for plain required misses. */
export function constraintFlags(
  error: string,
  missing: boolean,
  missingMessage = 'Please fill out this field.',
): { flags: ValidityStateFlags; message: string } {
  if (error) {
    return { flags: { customError: true }, message: error };
  }
  if (missing) {
    return { flags: { valueMissing: true }, message: missingMessage };
  }
  return { flags: {}, message: '' };
}
