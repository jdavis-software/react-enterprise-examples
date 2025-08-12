import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SortableHeaderCell } from './SortableHeaderCell';
import type { ColumnDef } from './types';

interface Row { name: string; }
const col: ColumnDef<Row> = { key: 'name', header: 'Name', sortable: true };

describe('SortableHeaderCell', () => {
  it('toggles sort on click and keyboard', () => {
    const onSort = vi.fn();
    const { rerender } = render(
      <table>
        <thead>
          <tr>
            <SortableHeaderCell<Row> col={col} active dir="asc" onSort={onSort} />
          </tr>
        </thead>
      </table>
    );
    const button = screen.getByRole('button', { name: 'Name' });
    fireEvent.click(button);
    expect(onSort).toHaveBeenCalledWith('name', 'desc');
    rerender(
      <table>
        <thead>
          <tr>
            <SortableHeaderCell<Row> col={col} active dir="desc" onSort={onSort} />
          </tr>
        </thead>
      </table>
    );
    const btn2 = screen.getByRole('button', { name: 'Name' });
    fireEvent.keyDown(btn2, { key: ' ', code: 'Space' });
    expect(onSort).toHaveBeenLastCalledWith('name', 'asc');
  });

  it('sets aria-sort when active', () => {
    const { rerender } = render(
      <table>
        <thead>
          <tr>
            <SortableHeaderCell<Row> col={col} active dir="asc" onSort={() => {}} />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending');
    rerender(
      <table>
        <thead>
          <tr>
            <SortableHeaderCell<Row> col={col} active dir="desc" onSort={() => {}} />
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
  });
});
