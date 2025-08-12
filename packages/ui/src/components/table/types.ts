import * as React from 'react';
export type SortDir = 'asc' | 'desc';

export interface ColumnDef<T> {
  key: keyof T;
  header: string | React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'start' | 'center' | 'end';
  render?: (row: T) => React.ReactNode;
  headerAriaLabel?: string;
}

export interface TableCommonProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  sortKey?: keyof T;
  sortDir?: SortDir;
  onSort?: (key: keyof T, dir: SortDir) => void;
  variant?: 'surface' | 'plain';
  density?: 'compact' | 'cozy' | 'comfortable';
  zebra?: boolean;
  stickyHeader?: boolean;
  bordered?: boolean;
  selectable?: boolean;
  isRowSelected?: (row: T) => boolean;
  onRowSelect?: (row: T, selected: boolean) => void;
  getRowId?: (row: T, index: number) => string | number;
  className?: string;
  style?: React.CSSProperties;
}
