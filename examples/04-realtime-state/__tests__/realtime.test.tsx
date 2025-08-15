import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { Table, ColumnDef } from '@react-enterprise-examples/ui';
import { makeDevices, Device } from '../src/generateDevices';

function applyBatch(prev: Device[], batch: { id: string; patch: Partial<Device> }[]): Device[] {
  const map = new Map(prev.map((d, i) => [d.id, i]));
  const next = [...prev];
  for (const u of batch) {
    const idx = map.get(u.id);
    if (idx !== undefined) next[idx] = { ...next[idx], ...u.patch };
  }
  return next;
}

test('selection stays after batch update', async () => {
  const data = makeDevices(5);
  const columns: ColumnDef<Device>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' }
  ];
  const selected = new Set<string>();
  const renderTable = (rows: Device[]) => (
    <Table<Device>
      dataBehavior="realtime"
      renderBehavior="standard"
      columns={columns}
      data={rows}
      sortKey="id"
      sortDir="asc"
      onSort={() => {}}
      selectable
      isRowSelected={(row) => selected.has(row.id)}
      onRowSelect={(row) => {
        if (selected.has(row.id)) selected.delete(row.id); else selected.add(row.id);
      }}
      getRowId={(r) => r.id}
    />
  );
  const { rerender } = render(renderTable(data));
  const rowsChecks = () => screen.getAllByRole('checkbox', { name: 'Select row' });
  await userEvent.click(rowsChecks()[0]);
  rerender(renderTable(data));
  expect(rowsChecks()[0]).toBeChecked();

  const next = applyBatch(data, [{ id: data[0].id, patch: { status: 'online' as const } }]);
  rerender(renderTable(next));
  expect(rowsChecks()[0]).toBeChecked();
});

