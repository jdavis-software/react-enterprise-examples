import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import type { ColumnDef, SortDir } from './types';
import { compareByKey } from './sort';

interface Device {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: number;
}

const meta: Meta<typeof Table<Device>> = {
  title: 'Components/Table',
  component: Table,
  argTypes: {
    renderBehavior: { control: 'radio', options: ['standard', 'virtualized'] },
    dataBehavior: { control: 'radio', options: ['batch', 'realtime'] },
    mode: {
      control: 'select',
      options: ['static', 'virtual'],
      description: 'Deprecated: use dataBehavior and renderBehavior.',
    },
    variant: { control: 'select', options: ['surface', 'plain'] },
    density: { control: 'select', options: ['compact', 'cozy', 'comfortable'] },
    zebra: { control: 'boolean' },
    bordered: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
  },
  args: {
    renderBehavior: 'standard',
    dataBehavior: 'batch',
    variant: 'surface',
    density: 'cozy',
    zebra: false,
    bordered: false,
    stickyHeader: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          '`renderBehavior` controls DOM strategy while `dataBehavior` controls streaming semantics. `mode` is deprecated and will be removed in a future release. See also: [Table behavior examples](?path=/docs/components-table-examples--docs).',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Table<Device>>;

const columns: ColumnDef<Device>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  {
    key: 'lastSeen',
    header: 'Last Seen',
    sortable: true,
    render: (d) => new Date(d.lastSeen).toLocaleTimeString(),
  },
];

const data: Device[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Device ${i + 1}`,
  status: ['online', 'offline', 'warning'][i % 3] as Device['status'],
  lastSeen: Date.now() - i * 1000,
}));

export const Basic: Story = {
  render: (args) => {
    const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({
      key: 'name',
      dir: 'asc',
    });
    const sorted = data.slice().sort((a, b) => compareByKey(a, b, sort.key, sort.dir));
    return (
      <Table<Device>
        {...args}
        columns={columns}
        data={sorted}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={(key, dir) => setSort({ key, dir })}
        {
          ...(args.renderBehavior === 'virtualized' || args.mode === 'virtual'
            ? { height: 300, rowHeight: 40 }
            : {})
        }
      />
    );
  },
};

export const SortableHeaders: Story = {
  name: 'Sortable headers',
  render: (args) => {
    const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({
      key: 'name',
      dir: 'asc',
    });
    const sorted = data.slice().sort((a, b) => compareByKey(a, b, sort.key, sort.dir));
    return (
      <Table<Device>
        {...args}
        columns={columns}
        data={sorted}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={(key, dir) => setSort({ key, dir })}
      />
    );
  },
};

export const RealtimeFriendly: Story = {
  name: 'Realtime-friendly',
  args: { dataBehavior: 'realtime', renderBehavior: 'standard' },
  parameters: {
    docs: {
      description: {
        story: 'Defaults tuned for realtime streams. Consider enabling reduced motion.',
      },
    },
  },
  render: (args) => {
    const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({
      key: 'name',
      dir: 'asc',
    });
    const sorted = data.slice().sort((a, b) => compareByKey(a, b, sort.key, sort.dir));
    return (
      <Table<Device>
        {...args}
        columns={columns}
        data={sorted}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={(key, dir) => setSort({ key, dir })}
      />
    );
  },
};
