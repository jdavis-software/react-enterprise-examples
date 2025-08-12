import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './Table';
import type { ColumnDef } from './types';

interface Row { id: number; value: string; }

const columns: ColumnDef<Row>[] = [{ key: 'value', header: 'Value' }];

describe('Table virtual', () => {
  it('renders only viewport rows', () => {
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i, value: `Row ${i}` }));
    const { container } = render(
      <Table<Row>
        mode="virtual"
        columns={columns}
        data={data}
        height={100}
        rowHeight={20}
      />
    );
    expect(container.querySelectorAll('[role="row"]').length).toBeLessThan(15);
  });

  it('uses stable item keys', () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ id: i, value: `Row ${i}` }));
    const { rerender } = render(
      <Table<Row>
        mode="virtual"
        columns={columns}
        data={data}
        getRowId={(r) => r.id}
        height={60}
        rowHeight={20}
      />
    );
    const row0 = screen.getByText('Row 0').closest('[role="row"]');
    rerender(
      <Table<Row>
        mode="virtual"
        columns={columns}
        data={[data[1], data[0], ...data.slice(2)]}
        getRowId={(r) => r.id}
        height={60}
        rowHeight={20}
      />
    );
    expect(screen.getByText('Row 0').closest('[role="row"]')).toBe(row0);
  });

  it('memoizes rows to prevent unnecessary re-renders', () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ id: i, value: `Row ${i}` }));
    const renderCounts: Record<number, number> = {};
    const cols: ColumnDef<Row>[] = [
      {
        key: 'value',
        header: 'Value',
        render: (r) => {
          renderCounts[r.id] = (renderCounts[r.id] || 0) + 1;
          return r.value;
        },
      },
    ];
    const { rerender } = render(
      <Table<Row>
        mode="virtual"
        columns={cols}
        data={data}
        getRowId={(r) => r.id}
        height={60}
        rowHeight={20}
      />
    );
    rerender(
      <Table<Row>
        mode="virtual"
        columns={cols}
        data={[{ id: 0, value: 'Row 0*' }, ...data.slice(1)]}
        getRowId={(r) => r.id}
        height={60}
        rowHeight={20}
      />
    );
    expect(renderCounts[0]).toBeGreaterThan(1);
    expect(renderCounts[1]).toBe(1);
  });
});
