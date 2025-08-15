import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './Table';
import type { ColumnDef } from './types';

interface Row { id: number; name: string; }

const columns: ColumnDef<Row>[] = [{ key: 'name', header: 'Name' }];


describe('Table prop guards', () => {
  it('falls back to standard render when virtualized requirements are missing', () => {
    const data = [{ id: 1, name: 'A' }];
    const { container } = render(
      // @ts-expect-error intentionally misconfigured to test guard
      <Table<Row> renderBehavior="virtualized" columns={columns} data={data} />
    );
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('defaults to standard render for invalid renderBehavior', () => {
    const data = [{ id: 1, name: 'A' }];
    const { container } = render(
      // @ts-expect-error invalid renderBehavior
      <Table<Row> renderBehavior={"bogus" as any} columns={columns} data={data} />
    );
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('ignores invalid variant and density', () => {
    const data = [{ id: 1, name: 'A' }];
    const { container } = render(
      // @ts-expect-error invalid variant and density
      <Table<Row> columns={columns} data={data} variant={"weird" as any} density={"foo" as any} />
    );
    const table = container.querySelector('table');
    expect(table?.classList.contains('ui-table--surface')).toBe(true);
    expect(table?.classList.contains('ui-table--density-cozy')).toBe(true);
  });
});
