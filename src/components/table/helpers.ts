import {
  jsonArrayConverter,
  parseJsonArrayAttribute,
} from '../../lib/json-attr.js';
import type { TableSection } from './types.js';

export const NARROW_MQ = '(max-width: 36rem)';

function isTableSection(item: unknown): item is TableSection {
  return (
    Boolean(item) &&
    typeof item === 'object' &&
    typeof (item as TableSection).id === 'string' &&
    typeof (item as TableSection).label === 'string'
  );
}

function mapTableSection(item: TableSection): TableSection {
  return {
    id: item.id,
    label: item.label,
    collapsed: Boolean(item.collapsed),
    meta: typeof item.meta === 'string' ? item.meta : undefined,
    count: item.count === false ? false : undefined,
  };
}

export function parseSectionsAttribute(value: string | null): TableSection[] {
  return parseJsonArrayAttribute(value, isTableSection, mapTableSection);
}

export const sectionsConverter = jsonArrayConverter(parseSectionsAttribute);

export function compareSortValues(a: string, b: string): number {
  const na = Number(a);
  const nb = Number(b);
  if (a !== '' && b !== '' && !Number.isNaN(na) && !Number.isNaN(nb)) {
    return na - nb;
  }
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
}
