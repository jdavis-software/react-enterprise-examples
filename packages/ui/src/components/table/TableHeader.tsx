import React from 'react';
import { ColumnDef, SortDir } from './types';
import { SortableHeaderCell } from './SortableHeaderCell';
import { TableCell } from './TableCell';

export function TableHeader<T>({
  columns,
  sortKey,
  sortDir,
  onSort,
  selectable
}: {
  columns: ColumnDef<T>[];
  sortKey?: keyof T;
  sortDir?: SortDir;
  onSort?: (key: keyof T, dir: SortDir) => void;
  selectable?: boolean;
}) {
  return (
    <thead>
      <tr className="ui-table__row ui-table__row--header">
        {selectable && <TableCell header />}
        {columns.map((col, i) => {
          const active = sortKey === col.key;
          const dir = active ? sortDir ?? 'asc' : 'asc';
          return col.sortable && onSort ? (
            <SortableHeaderCell<T>
              key={`${String(col.key)}-${i}`}
              col={col}
              active={active}
              dir={dir}
              onSort={onSort}
            />
          ) : (
            <TableCell
              key={`${String(col.key)}-${i}`}
              header
              width={col.width}
              align={col.align}
              aria-label={col.headerAriaLabel}
            >
              {col.header}
            </TableCell>
          );
        })}
      </tr>
    </thead>
  );
}
