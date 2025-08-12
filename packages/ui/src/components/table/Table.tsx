import * as React from 'react';
import type { TableCommonProps, SortDir } from './types';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { VirtualTableBody } from './VirtualTableBody';
import './_table.scss';

export type TableMode = 'static' | 'virtual';

export interface TableProps<T> extends TableCommonProps<T> {
  mode?: TableMode;
  height?: number;
  rowHeight?: number;
  width?: number | 'auto';
}

export function Table<T>({
  mode = 'static',
  columns,
  data,
  sortKey,
  sortDir,
  onSort,
  variant = 'surface',
  density = 'cozy',
  zebra,
  stickyHeader,
  bordered,
  selectable,
  isRowSelected,
  onRowSelect,
  getRowId,
  className,
  style,
  height,
  rowHeight,
  width,
}: TableProps<T>) {
  const classes = [
    'ui-table',
    `ui-table--${variant}`,
    `ui-table--density-${density}`,
    zebra ? 'ui-table--zebra' : '',
    stickyHeader ? 'ui-table--sticky-header' : '',
    bordered ? 'ui-table--bordered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleSort = React.useCallback((key: keyof T, dir: SortDir) => onSort?.(key, dir), [onSort]);

  const header = (
    <TableHeader<T>
      columns={columns}
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={onSort ? handleSort : undefined}
      selectable={selectable}
    />
  );

  if (mode === 'virtual') {
    return (
      <div className={classes} style={style} role="grid">
        <table>{header}</table>
        {height && rowHeight ? (
          <VirtualTableBody<T>
            height={height}
            rowHeight={rowHeight}
            width={width}
            data={data}
            columns={columns}
            getRowId={getRowId}
            selectable={selectable}
            isRowSelected={isRowSelected}
            onRowSelect={onRowSelect}
          />
        ) : null}
      </div>
    );
  }

  return (
    <table className={classes} style={style} role="grid">
      {header}
      <TableBody<T>
        columns={columns}
        data={data}
        getRowId={getRowId}
        selectable={selectable}
        isRowSelected={isRowSelected}
        onRowSelect={onRowSelect}
      />
    </table>
  );
}
