import * as React from 'react';
import type { ColumnDef, SortDir } from './types';
import { nextDir } from './sort';

export function SortableHeaderCell<T>({
  col,
  active,
  dir,
  onSort,
}: {
  col: ColumnDef<T>;
  active: boolean;
  dir: SortDir;
  onSort: (key: keyof T, dir: SortDir) => void;
}) {
  const handleSort = React.useCallback(() => onSort(col.key, nextDir(dir)), [col.key, dir, onSort]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort();
    }
  };
  const ariaSort = active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined;
  const label = typeof col.header === 'string' ? col.header : col.headerAriaLabel;
  return (
    <th className="ui-table__th" aria-sort={ariaSort} scope="col">
      <button
        type="button"
        className="ui-table__sort-button"
        aria-label={label}
        onClick={handleSort}
        onKeyDown={onKeyDown}
      >
        {col.header}
        <span aria-hidden="true">{active ? (dir === 'asc' ? '▲' : '▼') : ''}</span>
      </button>
    </th>
  );
}
