import * as React from 'react';
import type { ColumnDef } from './types';

export function TableBody<T>({
  columns,
  data,
  getRowId,
  selectable,
  isRowSelected,
  onRowSelect,
}: {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string | number;
  selectable?: boolean;
  isRowSelected?: (row: T) => boolean;
  onRowSelect?: (row: T, selected: boolean) => void;
}) {
  return (
    <tbody>
      {data.map((row, i) => {
        const id = getRowId ? getRowId(row, i) : i;
        const selected = selectable ? isRowSelected?.(row) : false;
        const handleSelect = selectable ? () => onRowSelect?.(row, !selected) : undefined;
        const classes = ['ui-table__row', selected ? 'ui-table__row--selected' : '']
          .filter(Boolean)
          .join(' ');
        return (
          <tr key={id} className={classes} data-rowid={id}>
            {selectable && (
              <td className="ui-table__cell">
                <input
                  type="checkbox"
                  aria-label="Select row"
                  checked={selected}
                  onChange={handleSelect}
                />
              </td>
            )}
            {columns.map((col) => (
              <td
                key={String(col.key)}
                className="ui-table__cell"
                style={{ width: col.width, textAlign: col.align }}
              >
                {col.render ? col.render(row) : (row as any)[col.key]}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}
