import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from './Table';
import type { ColumnDef } from './types';

interface Row { id: number; name: string; }

const columns: ColumnDef<Row>[] = [{ key: 'name', header: 'Name' }];

describe('Table prop guards', () => {
  it('falls back to static mode when virtual requirements are missing', () => {
    const data = [{ id: 1, name: 'A' }];
    const { container } = render(
      // @ts-expect-error intentionally misconfigured to test guard
      <Table<Row> mode="virtual" columns={columns} data={data} />
    );
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('defaults to static mode for invalid mode', () => {
    const data = [{ id: 1, name: 'A' }];
    const { container } = render(
      // @ts-expect-error invalid mode
      <Table<Row> mode={"bogus" as any} columns={columns} data={data} />
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
