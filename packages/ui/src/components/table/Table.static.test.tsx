import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Table } from './Table';
import type { ColumnDef } from './types';

interface Row { id: number; name: string; }

const columns: ColumnDef<Row>[] = [{ key: 'name', header: 'Name' }];

describe('Table static', () => {
  it('maps deprecated mode="static" to standard render', () => {
    const data = [{ id: 1, name: 'A' }];
    const { container } = render(<Table<Row> mode="static" columns={columns} data={data} />);
    expect(container.querySelector('tbody')).toBeTruthy();
  });

  it('renders rows and cells', () => {
    const data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    render(<Table<Row> columns={columns} data={data} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('handles selection callbacks', async () => {
    const data = [{ id: 1, name: 'A' }];
    const onRowSelect = vi.fn();
    render(
      <Table<Row>
        columns={columns}
        data={data}
        selectable
        isRowSelected={() => false}
        onRowSelect={onRowSelect}
      />
    );
    const checkbox = screen.getByLabelText('Select row');
    await userEvent.click(checkbox);
    expect(onRowSelect).toHaveBeenCalledWith(data[0], true);
  });

  it('uses getRowId for stable keys', () => {
    const data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    const { rerender } = render(
      <Table<Row> columns={columns} data={data} getRowId={(r) => r.id} />
    );
    const rowA = screen.getByText('A').closest('tr');
    rerender(
      <Table<Row>
        columns={columns}
        data={[data[1], data[0]]}
        getRowId={(r) => r.id}
      />
    );
    expect(screen.getByText('A').closest('tr')).toBe(rowA);
  });

  it('supports realtime data with standard render', () => {
    const data = [{ id: 1, name: 'A' }];
    const { container } = render(
      <Table<Row>
        columns={columns}
        data={data}
        dataBehavior="realtime"
        renderBehavior="standard"
      />
    );
    expect(container.querySelector('tbody')).toBeTruthy();
  });
});
