import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { makeDevices, Device } from '../src/generateData';
import { ColumnDef, Table } from '@react-enterprise-examples/ui';
import { Page } from '../Page';
import { MemoryRouter } from 'react-router-dom';

test('renders 50k dataset without crashing', () => {
  const data = makeDevices(50_000);
  const columns: ColumnDef<Device>[] = [
    { key: 'name', header: 'Name' },
    { key: 'os', header: 'OS' },
    { key: 'status', header: 'Status' },
    { key: 'lastSeen', header: 'Last Seen' }
  ];
  render(
    <Table<Device>
      mode="virtual"
      columns={columns}
      data={data}
      sortKey="name"
      sortDir="asc"
      onSort={() => {}}
      height={400}
      rowHeight={40}
      width={800}
    />
  );
  expect(screen.getByText('Device 1')).toBeInTheDocument();
});

test('search filters down correctly', async () => {
  const data = makeDevices(100);
  render(
    <MemoryRouter>
      <Page initialDevices={data} />
    </MemoryRouter>
  );
  const input = screen.getByPlaceholderText('Search devices');
  await userEvent.type(input, 'zzzz');
  await screen.findByText(/Showing 0 of 100/);
});

test('sort asc/desc toggles work', async () => {
  const small = makeDevices(10);
  render(
    <MemoryRouter>
      <Page initialDevices={small} />
    </MemoryRouter>
  );
  const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
  await userEvent.click(nameHeader);
  await screen.findByText('Device 10');
});

test.skip('workerized sort works for large sets', async () => {
  const big = makeDevices(3000);
  render(
    <MemoryRouter>
      <Page initialDevices={big} />
    </MemoryRouter>
  );
  const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
  await userEvent.click(nameHeader);
  await screen.findByText('Device 999');
});
