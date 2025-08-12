import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './Table';
import type { ColumnDef } from './types';

interface Row { id: string; name: string; }

const columns: ColumnDef<Row>[] = [{ key: 'name', header: 'Name', render: r => r.name }];
const data: Row[] = [{ id: '1', name: 'Alice' }];

describe('Table', () => {
  it('renders typed rows and uses getRowId', () => {
    const { container } = render(
      <Table<Row> columns={columns} data={data} getRowId={(r) => r.id} />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    const row = container.querySelector('tbody tr');
    expect(row?.getAttribute('data-rowid')).toBe('1');
  });
});
