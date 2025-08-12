import * as React from 'react';
import type { ColumnDef, SortDir } from './types';
import { SortableHeaderCell } from './SortableHeaderCell';

export function TableHeader<T>({
  columns,
  sortKey,
  sortDir,
  onSort,
  selectable,
}: {
  columns: ColumnDef<T>[];
  sortKey?: keyof T;
  sortDir?: SortDir;
  onSort?: (key: keyof T, dir: SortDir) => void;
  selectable?: boolean;
}) {
  return (
    <thead className="ui-table__header">
      <tr className="ui-table__row">
        {selectable && <th className="ui-table__th" scope="col" />}
        {columns.map((col) => {
          const active = sortKey === col.key;
          const dir = active ? sortDir ?? 'asc' : 'asc';
          return col.sortable && onSort ? (
            <SortableHeaderCell<T>
              key={String(col.key)}
              col={col}
              active={active}
              dir={dir}
              onSort={onSort}
            />
          ) : (
            <th
              key={String(col.key)}
              className="ui-table__th"
              scope="col"
              style={{ width: col.width, textAlign: col.align }}
              aria-label={col.headerAriaLabel}
            >
              {col.header}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
