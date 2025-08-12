import React, { memo, useCallback, useRef, useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import type { Device } from './generateData';
import type { SortDir, SortKey } from './sort';
import '../styles/_table.scss';

type Props = {
  items: Device[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
};

const ROW_HEIGHT = 40;

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div role="cell" className="cell">
      {children}
    </div>
  );
}

const NameCell = ({ value }: { value: string }) => <Cell>{value}</Cell>;
const OsCell = ({ value }: { value: string }) => <Cell>{value}</Cell>;
const StatusCell = ({ value }: { value: string }) => <Cell>{value}</Cell>;
const LastSeenCell = ({ value }: { value: number }) => (
  <Cell>{new Date(value).toLocaleTimeString()}</Cell>
);

type RowData = {
  items: Device[];
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
      className="row"
      onKeyDown={onKeyDown}
      onFocus={() => data.setFocused(index)}
    >
      <NameCell value={item.name} />
      <OsCell value={item.os} />
      <StatusCell value={item.status} />
      <LastSeenCell value={item.lastSeen} />
    </div>
  );
});
Row.displayName = 'Row';

export function VirtualizedDevices({ items, sortKey, sortDir, onSort }: Props) {
  const listRef = useRef<List>(null);
  const [focused, setFocused] = useState(0);

  const setFocusedIndex = useCallback(
    (n: number) => {
      setFocused(n);
      listRef.current?.scrollToItem(n);
    },
    []
  );

  const header = (key: SortKey, label: string) => {
    const dir = sortKey === key ? (sortDir === 'asc' ? '▲' : '▼') : '';
    return (
      <div
        role="columnheader"
        className="cell header"
        onClick={() => onSort(key)}
        style={{ cursor: 'pointer' }}
      >
        {label} {dir}
      </div>
    );
  };

  return (
    <div role="table" className="device-table">
      <div role="row" className="row header-row">
        {header('name', 'Name')}
        {header('os', 'OS')}
        {header('status', 'Status')}
        {header('lastSeen', 'Last Seen')}
      </div>
      <List
        height={400}
        itemCount={items.length}
        itemSize={ROW_HEIGHT}
        width={'100%'}
        ref={listRef}
        itemData={{ items, focused, setFocused: setFocusedIndex }}
      >
        {Row}
      </List>
    </div>
  );
}
