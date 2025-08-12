import React from 'react';
import { ColumnDef, SortDir } from './types';
import { nextDir } from './sort';
import { TableCell } from './TableCell';

export function SortableHeaderCell<T>({
  col,
  active,
  dir,
  onSort
}: {
  col: ColumnDef<T>;
  active: boolean;
  dir: SortDir;
  onSort: (key: keyof T, next: SortDir) => void;
}) {
  const ariaSort = active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined;
  const handleSort = () => onSort(col.key, nextDir(dir));
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort();
    }
  };
  return (
    <TableCell
      header
      width={col.width}
      align={col.align}
      aria-sort={ariaSort}
    >
      <button
        type="button"
        aria-label={typeof col.header === 'string' ? col.header : col.headerAriaLabel}
        className="ui-table__sort-button"
        onClick={handleSort}
        onKeyDown={onKeyDown}
      >
        {col.header}
        <span aria-hidden="true" className="ui-table__sort-indicator">
          {active ? (dir === 'asc' ? '▲' : '▼') : ''}
        </span>
      </button>
    </TableCell>
  );
}
