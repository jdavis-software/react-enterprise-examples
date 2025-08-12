import { useMemo, useRef, useState } from 'react';
import { AriaLive } from '@react-enterprise-examples/ui';
import { useIntl } from 'react-intl';
import './DataGrid.scss';

const PAGE_SIZE = 20;

interface Row {
  name: string;
  status: string;
  lastSeen: string;
}

function createRows(): Row[] {
  return Array.from({ length: 200 }, (_, i) => ({
    name: `User ${i + 1}`,
    status: i % 2 ? 'Active' : 'Inactive',
    lastSeen: `2024-01-${(i % 30) + 1}`
  }));
}

export function DataGrid() {
  const intl = useIntl();
  const [sort, setSort] = useState<'ascending' | 'descending' | 'none'>('none');
  const [page, setPage] = useState(0);
  const [focus, setFocus] = useState({ row: 0, col: 0 });
  const [announcement, setAnnouncement] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    let rows = createRows();
    if (sort !== 'none') {
      rows = [...rows].sort((a, b) =>
        sort === 'ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    }
    return rows;
  }, [sort]);

  const pageData = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const moveFocus = (row: number, col: number) => {
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-row="${row}"][data-col="${col}"]`);
    el?.focus();
    setFocus({ row, col });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let { row, col } = focus;
    if (e.key === 'ArrowRight') {
      col = Math.min(col + 1, 2);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      col = Math.max(col - 1, 0);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      row = Math.min(row + 1, pageData.length - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      row = Math.max(row - 1, 0);
      e.preventDefault();
    } else {
      return;
    }
    moveFocus(row, col);
  };

  const changeSort = () => {
    const next = sort === 'ascending' ? 'descending' : 'ascending';
    setSort(next);
    setAnnouncement(
      intl.formatMessage(
        { id: 'sorted' },
        { column: intl.formatMessage({ id: 'name' }), direction: next }
      )
    );
    moveFocus(0, 0);
  };

  const nextPage = () => {
    setPage(p => Math.min(p + 1, Math.floor(data.length / PAGE_SIZE)));
    setTimeout(() => moveFocus(0, 0));
  };

  const prevPage = () => {
    setPage(p => Math.max(p - 1, 0));
    setTimeout(() => moveFocus(0, 0));
  };

  return (
    <div className="data-grid" ref={gridRef} role="grid" aria-rowcount={data.length}>
      <div role="row" className="header">
        <button role="columnheader" aria-sort={sort} onClick={changeSort}>
          {intl.formatMessage({ id: 'name' })}
        </button>
        <div role="columnheader">{intl.formatMessage({ id: 'status' })}</div>
        <div role="columnheader">{intl.formatMessage({ id: 'lastSeen' })}</div>
      </div>
      {pageData.map((rowData, rowIdx) => (
        <div role="row" key={rowIdx}>
          {['name', 'status', 'lastSeen'].map((col, colIdx) => (
            <div
              key={col}
              role="gridcell"
              tabIndex={focus.row === rowIdx && focus.col === colIdx ? 0 : -1}
              data-row={rowIdx}
              data-col={colIdx}
              onFocus={() => setFocus({ row: rowIdx, col: colIdx })}
              onKeyDown={onKeyDown}
            >
              {(rowData as any)[col]}
            </div>
          ))}
        </div>
      ))}
      <div className="pagination" role="row">
        <button onClick={prevPage} aria-label="Previous page">
          Prev
        </button>
        <span>{page + 1}</span>
        <button onClick={nextPage} aria-label="Next page">
          Next
        </button>
      </div>
      <AriaLive mode="polite">{announcement}</AriaLive>
    </div>
  );
}
