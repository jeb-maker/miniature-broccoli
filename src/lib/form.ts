export type ValidityTarget = {
  setCustomValidity?: (message: string) => void;
};

/** Shared helpers for form-associated custom elements. */
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
