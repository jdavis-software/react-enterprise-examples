import React from 'react';
import { ColumnDef } from './types';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableEmpty } from './TableEmpty';

export function TableBody<T>({
  columns,
  data,
  getRowId,
  selectable,
  isRowSelected,
  onRowSelect,
  emptyMessage
}: {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string | number;
  selectable?: boolean;
  isRowSelected?: (row: T) => boolean;
  onRowSelect?: (row: T, selected: boolean) => void;
  emptyMessage?: string;
}) {
  if (!data.length) {
    return (
      <tbody>
        {emptyMessage ? (
          <TableEmpty colSpan={columns.length + (selectable ? 1 : 0)} message={emptyMessage} />
        ) : null}
      </tbody>
    );
  }
  return (
    <tbody>
      {data.map((row, i) => {
        const id = getRowId ? getRowId(row, i) : i;
        const selected = selectable && isRowSelected?.(row);
        const onSelect = selectable ? () => onRowSelect?.(row, !selected) : undefined;
        return (
          <TableRow key={id} rowId={id} selected={!!selected} onClick={onSelect}>
            {selectable && (
              <TableCell>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={onSelect}
                  aria-label="Select row"
                />
              </TableCell>
            )}
            {columns.map((col, ci) => (
              <TableCell key={`${String(col.key)}-${ci}`} width={col.width} align={col.align}>
                {col.render ? col.render(row) : (row as any)[col.key] as React.ReactNode}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </tbody>
  );
}
