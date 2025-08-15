import * as React from 'react';
import type { TableProps, SortDir } from './types';
import { AriaLive } from '../../a11y/AriaLive';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { VirtualTableBody } from './VirtualTableBody';
import './_table.scss';
const VALID_RENDER_BEHAVIORS = ['standard', 'virtualized'] as const;
const VALID_DATA_BEHAVIORS = ['batch', 'realtime'] as const;
const VALID_VARIANTS = ['surface', 'plain'] as const;
const VALID_DENSITIES = ['compact', 'cozy', 'comfortable'] as const;

export function Table<T>(props: TableProps<T>) {
  const warned = React.useRef(false);

  let {
    mode,
    renderBehavior,
    dataBehavior,
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

  if (process.env.NODE_ENV !== 'production' && mode && !warned.current) {
    console.warn(
      'Table `mode` prop is deprecated. Use `dataBehavior` and `renderBehavior` instead.'
    );
    warned.current = true;
  }

  let finalRender =
    renderBehavior ?? (mode === 'virtual' ? 'virtualized' : 'standard');
  let finalData = dataBehavior ?? 'batch';

  if (!VALID_RENDER_BEHAVIORS.includes(finalRender as any)) {
    console.warn(
      `Invalid table renderBehavior "${finalRender}". Falling back to "standard".`
    );
    finalRender = 'standard';
  }

  if (!VALID_DATA_BEHAVIORS.includes(finalData as any)) {
    console.warn(
      `Invalid table dataBehavior "${finalData}". Falling back to "batch".`
    );
    finalData = 'batch';
  }

  if (!VALID_VARIANTS.includes(variant as any)) {
    console.warn(`Invalid table variant "${variant}". Falling back to "surface".`);
    variant = 'surface';
  }

  if (!VALID_DENSITIES.includes(density as any)) {
    console.warn(`Invalid table density "${density}". Falling back to "cozy".`);
    density = 'cozy';
  }

  if (finalRender === 'virtualized' && (!height || !rowHeight)) {
    console.warn(
      '`renderBehavior="virtualized"` requires both `height` and `rowHeight`. Reverting to standard render.'
    );
    finalRender = 'standard';
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

  const liveRegion = finalData === 'realtime' ? <AriaLive /> : null;

  if (finalRender === 'virtualized') {
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
        {liveRegion}
      </div>
    );
  }

  return (
    <>
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
      {liveRegion}
    </>
  );
}
