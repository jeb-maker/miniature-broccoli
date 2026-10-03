/**
 * Public entry for `@jeb-maker/mb/table`.
 * Registers `mb-table`, `mb-table-row`, and `mb-table-cell`.
 */
export type {
  TableLayout,
  TableDensity,
  TableCellAlign,
  TableSortDirection,
  TableSection,
} from './table/types.js';

export { MbTable } from './table/mb-table.js';
export { MbTableRow } from './table/mb-table-row.js';
export { MbTableCell } from './table/mb-table-cell.js';
