import React, { memo, useCallback, useRef, useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import type { Device } from './generateData';
import type { SortDir, SortKey } from './sort';
import type { ColumnDef } from '@react-enterprise-examples/ui';
import { TableHeader } from '@react-enterprise-examples/ui';
import '../../../packages/ui/src/components/table/_table.scss';

type Props = {
  items: Device[];
  columns: ColumnDef<Device>[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey, dir: SortDir) => void;
};

const ROW_HEIGHT = 40;

type RowData = {
  items: Device[];
  columns: ColumnDef<Device>[];
  focused: number;
  setFocused: (n: number) => void;
};

const Row = memo(({ index, style, data }: ListChildComponentProps<RowData>) => {
  const item = data.items[index];
  const isFocused = index === data.focused;
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(data.items.length - 1, index + 1);
      data.setFocused(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(0, index - 1);
      data.setFocused(prev);
    }
  };

  return (
    <div
      role="row"
      tabIndex={isFocused ? 0 : -1}
      ref={ref}
      style={style}
      className="ui-table__row"
      onKeyDown={onKeyDown}
      onFocus={() => data.setFocused(index)}
    >
      {data.columns.map((col, i) => (
        <div
          key={i}
          role="gridcell"
          className="ui-table__cell"
          style={{ width: col.width, textAlign: col.align }}
        >
          {col.render ? col.render(item) : (item as any)[col.key]}
        </div>
      ))}
    </div>
  );
});
Row.displayName = 'Row';

export function VirtualizedDevices({ items, columns, sortKey, sortDir, onSort }: Props) {
  const listRef = useRef<List>(null);
  const [focused, setFocused] = useState(0);

  const setFocusedIndex = useCallback(
    (n: number) => {
      setFocused(n);
      listRef.current?.scrollToItem(n);
    },
    []
  );

  return (
    <div className="ui-table ui-table--density-cozy ui-table--bordered" role="grid">
      <table>
        <TableHeader<Device>
          columns={columns}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
        />
      </table>
      <List
        height={400}
        itemCount={items.length}
        itemSize={ROW_HEIGHT}
        width={'100%'}
        ref={listRef}
        itemData={{ items, columns, focused, setFocused: setFocusedIndex }}
      >
        {Row}
      </List>
    </div>
  );
}
