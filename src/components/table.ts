/**
 * Public entry for `@jeb-maker/mb/table`.
 * Registers `mb-table`, `mb-table-row`, and `mb-table-cell`.
 *
 * Side-effect imports keep `safeDefine(...)` reachable when bundlers tree-shake
 * unused re-exports from this barrel (see #56).
 */
import './table/mb-table.js';
import './table/mb-table-row.js';
import './table/mb-table-cell.js';

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
