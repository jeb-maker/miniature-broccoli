export type TableLayout = 'auto' | 'table' | 'cards';
export type TableDensity = 'default' | 'compact';
export type TableCellAlign = 'start' | 'center' | 'end';
export type TableSortDirection = 'asc' | 'desc';
export type TableSection = {
  id: string;
  label: string;
  collapsed?: boolean;
  /** Extra status copy in the section head (e.g. `8 / 12 OK`). */
  meta?: string;
  /** When `false`, hide the auto row count for this section. Default: show. */
  count?: boolean;
};
