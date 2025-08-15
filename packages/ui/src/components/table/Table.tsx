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

const VALID_MODES: TableMode[] = ['static', 'virtual'];
const VALID_VARIANTS = ['surface', 'plain'] as const;
const VALID_DENSITIES = ['compact', 'cozy', 'comfortable'] as const;

export function Table<T>(props: TableProps<T>) {
  let {
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
  } = props;

  if (!VALID_MODES.includes(mode as any)) {
    console.warn(`Invalid table mode "${mode}". Falling back to "static".`);
    mode = 'static';
  }

  if (!VALID_VARIANTS.includes(variant as any)) {
    console.warn(`Invalid table variant "${variant}". Falling back to "surface".`);
    variant = 'surface';
  }

  if (!VALID_DENSITIES.includes(density as any)) {
    console.warn(`Invalid table density "${density}". Falling back to "cozy".`);
    density = 'cozy';
  }

  if (mode === 'virtual' && (!height || !rowHeight)) {
    console.warn('`mode="virtual"` requires both `height` and `rowHeight`. Reverting to static mode.');
    mode = 'static';
  }

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
