import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../src/components/table/Table';
import type { ColumnDef, SortDir } from '../src/components/table';
import { compareByKey } from '../src/components/table';

interface Device { id: number; name: string; status: string; lastSeen: number; }

const meta: Meta<typeof Table<Device>> = {
  title: 'Primitives/Table',
  component: Table,
};
export default meta;

type Story = StoryObj<typeof Table<Device>>;

const columns: ColumnDef<Device>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'lastSeen', header: 'Last Seen', sortable: true, render: d => new Date(d.lastSeen).toLocaleTimeString() }
];

const data: Device[] = [
  { id: 1, name: 'Alpha', status: 'online', lastSeen: Date.now() },
  { id: 2, name: 'Beta', status: 'offline', lastSeen: Date.now() - 100000 }
];

export const Basic: Story = {
  render: () => {
    const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({ key: 'name', dir: 'asc' });
    const sorted = data.slice().sort((a,b) => compareByKey(a,b, sort.key, sort.dir));
    return (
      <Table<Device>
        columns={columns}
        data={sorted}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={(key, dir) => setSort({ key, dir })}
        zebra
        density="cozy"
        bordered
      />
    );
  }
};
