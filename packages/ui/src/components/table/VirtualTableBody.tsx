import { FixedSizeList, ListChildComponentProps } from 'react-window';
import React from 'react';
import type { ColumnDef } from './types';

export interface VirtualTableBodyProps<T> {
  height: number;
  rowHeight: number;
  width?: number | 'auto';
  data: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface ItemData<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
}

function RowImpl<T>({ index, style, data }: ListChildComponentProps<ItemData<T>>) {
  const { rows, columns, getRowId, onRowClick } = data;
  const row = rows[index];
  const id = getRowId ? getRowId(row, index) : index;
  return (
    <div
      role="row"
      className="ui-table__row"
      style={{ ...style, display: 'flex' }}
      data-rowid={id}
      onClick={onRowClick ? () => onRowClick(row) : undefined}
    >
      {columns.map((col: ColumnDef<T>) => (
        <div
          role="cell"
          key={String(col.key)}
          className="ui-table__cell"
          style={{ width: col.width, textAlign: col.align }}
        >
          {col.render ? col.render(row) : (row as any)[col.key]}
        </div>
      ))}
    </div>
  );
}

const Row = React.memo(RowImpl, (a, b) => a.index === b.index && a.data.rows[a.index] === b.data.rows[b.index]);

export function VirtualTableBody<T>({
  height,
  rowHeight,
  width = 'auto',
  data,
  columns,
  getRowId,
  onRowClick,
  className,
  style,
}: VirtualTableBodyProps<T>) {
  const itemData = React.useMemo(() => ({ rows: data, columns, getRowId, onRowClick }), [data, columns, getRowId, onRowClick]);
  const itemKey = React.useCallback(
    (index: number, data: ItemData<T>) => {
      const row = data.rows[index];
      return data.getRowId ? data.getRowId(row, index) : index;
    },
    []
  );
  return (
    <FixedSizeList
      height={height}
      itemCount={data.length}
      itemSize={rowHeight}
      width={width}
      itemData={itemData}
      itemKey={itemKey}
      className={className}
      style={style}
    >
      {Row as any}
    </FixedSizeList>
  );
}
