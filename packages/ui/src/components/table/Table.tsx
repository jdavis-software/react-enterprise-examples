import React, { useState } from 'react';
import { AriaLive } from '../../a11y/AriaLive';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TableProps, SortDir } from './types';
import './_table.scss';

export function Table<T>({
  columns,
  data,
  sortKey,
  sortDir = 'asc',
  onSort,
  variant = 'surface',
  density = 'cozy',
  zebra = false,
  stickyHeader = false,
  bordered = false,
  getRowId,
  selectable = false,
  isRowSelected,
  onRowSelect,
  emptyMessage = 'No data',
  className,
  style
}: TableProps<T>) {
  const [live, setLive] = useState('');
  const classes = [
    'ui-table',
    `ui-table--${variant}`,
    `ui-table--density-${density}`,
    zebra ? 'ui-table--zebra' : '',
    stickyHeader ? 'ui-table--sticky-header' : '',
    bordered ? 'ui-table--bordered' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const handleSort = (key: keyof T, dir: SortDir) => {
    setLive(`Sorted by ${String(key)} ${dir === 'asc' ? 'ascending' : 'descending'}`);
    onSort?.(key, dir);
  };

  return (
    <div className={classes} style={style}>
      <table role="grid">
        <TableHeader<T>
          columns={columns}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort ? handleSort : undefined}
          selectable={selectable}
        />
        <TableBody<T>
          columns={columns}
          data={data}
          getRowId={getRowId}
          selectable={selectable}
          isRowSelected={isRowSelected}
          onRowSelect={onRowSelect}
          emptyMessage={emptyMessage}
        />
      </table>
      <AriaLive>{live}</AriaLive>
    </div>
  );
}
