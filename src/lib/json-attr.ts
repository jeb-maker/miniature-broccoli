/**
 * Shared JSON attribute helpers for array-valued Lit properties
 * (`options`, `items`, `sections`, …).
 */

export type JsonObjectGuard<T> = (item: unknown) => item is T;

/** Parse a JSON array attribute; invalid or non-array input yields `[]`. */
export function parseJsonArrayAttribute<T>(
  value: string | null,
  isItem: JsonObjectGuard<T>,
  mapItem: (item: T) => T,
): T[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isItem).map(mapItem);
  } catch {
    return [];
  }
}

/** Lit attribute converter for JSON arrays (empty → omit attribute). */
export function jsonArrayConverter<T>(
  fromAttribute: (value: string | null) => T[],
): {
  fromAttribute: (value: string | null) => T[];
  toAttribute(value: T[]): string | null;
} {
  return {
    fromAttribute,
    toAttribute(value: T[]): string | null {
      return value?.length ? JSON.stringify(value) : null;
    },
  };
}
