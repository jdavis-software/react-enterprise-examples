import {
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import type { ColumnDef, SortDir, TableProps } from './types';
import { compareByKey } from './sort';

type Device = {
  id: string;
  name: string;
  os: 'Windows' | 'macOS' | 'Linux';
  status: 'online' | 'offline' | 'warning';
  lastSeen: number;
};

const columns: ColumnDef<Device>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'os', header: 'OS', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  {
    key: 'lastSeen',
    header: 'Last Seen',
    sortable: true,
    render: (r) => new Date(r.lastSeen).toLocaleTimeString(),
  },
];

function seedRand(seed = 1) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function makeDevices(count = 500, seed = 1): Device[] {
  const rand = seedRand(seed);
  const oses: Device['os'][] = ['Windows', 'macOS', 'Linux'];
  const statuses: Device['status'][] = ['online', 'offline', 'warning'];
  const base = 1700000000000;
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Device ${i + 1}`,
    os: oses[Math.floor(rand() * oses.length)],
    status: statuses[Math.floor(rand() * statuses.length)],
    lastSeen: base - Math.floor(rand() * 1e7),
  }));
}

const ConnectionBadge = ({ status }: { status: string }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: 4,
      background:
        status === 'Open'
          ? '#d1fae5'
          : status === 'Connecting'
          ? '#fee2e2'
          : status === 'Closed'
          ? '#fef3c7'
          : '#fee2e2',
      color:
        status === 'Open'
          ? '#065f46'
          : status === 'Connecting'
          ? '#991b1b'
          : status === 'Closed'
          ? '#92400e'
          : '#991b1b',
    }}
  >
    {status}
  </span>
);

interface TableStoryArgs extends TableProps<Device> {
  jitterSmoothing: boolean;
  connectionBadge: 'Connecting' | 'Open' | 'Closed' | 'Error';
}

const meta: Meta<TableStoryArgs> = {
  title: 'Components/Table/Core',
  component: Table as any,
  args: {
    dataBehavior: 'batch',
    renderBehavior: 'standard',
    zebra: true,
    stickyHeader: true,
    density: 'cozy',
    variant: 'surface',
    height: 480,
    rowHeight: 40,
    jitterSmoothing: false,
    connectionBadge: 'Open',
  },
  argTypes: {
    dataBehavior: { control: 'radio', options: ['batch', 'realtime'] },
    renderBehavior: { control: 'radio', options: ['standard', 'virtualized'] },
    density: { control: 'radio', options: ['compact', 'cozy', 'comfortable'] },
    variant: { control: 'radio', options: ['surface', 'plain'] },
    zebra: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    bordered: { control: 'boolean' },
    height: {
      control: { type: 'number', min: 240, max: 800, step: 20 },
      if: { arg: 'renderBehavior', eq: 'virtualized' },
    },
    rowHeight: {
      control: { type: 'number', min: 28, max: 56, step: 2 },
      if: { arg: 'renderBehavior', eq: 'virtualized' },
    },
    jitterSmoothing: {
      control: 'boolean',
      if: { arg: 'dataBehavior', eq: 'realtime' },
    },
    connectionBadge: {
      control: 'select',
      options: ['Connecting', 'Open', 'Closed', 'Error'],
      if: { arg: 'dataBehavior', eq: 'realtime' },
    },
  },
  parameters: { controls: { expanded: true } },
};
export default meta;

export const Playground: StoryObj<TableStoryArgs> = {
  render: (args) => {
    const { jitterSmoothing, connectionBadge, ...tableArgs } = args;
    const [rows, setRows] = useState<Device[]>(() => makeDevices());
    const buffer = useRef(rows);
    const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({
      key: 'name',
      dir: 'asc',
    });

    useEffect(() => {
      buffer.current = rows;
    }, [rows]);

    useEffect(() => {
      if (tableArgs.dataBehavior !== 'realtime') return;
      const statuses: Device['status'][] = ['online', 'offline', 'warning'];
      let flushTimer: ReturnType<typeof setTimeout> | null = null;
      const interval = setInterval(() => {
        const updateCount = Math.floor(Math.random() * 8) + 3;
        for (let i = 0; i < updateCount; i++) {
          const idx = Math.floor(Math.random() * buffer.current.length);
          const r = buffer.current[idx];
          buffer.current[idx] = {
            ...r,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastSeen: Date.now(),
          };
        }
        if (!flushTimer) {
          flushTimer = setTimeout(() => {
            startTransition(() => setRows([...buffer.current]));
            flushTimer = null;
          }, jitterSmoothing ? 250 : 0);
        }
      }, 250);
      return () => {
        clearInterval(interval);
        if (flushTimer) clearTimeout(flushTimer);
      };
    }, [tableArgs.dataBehavior, jitterSmoothing]);

    const sorted = useMemo(
      () => rows.slice().sort((a, b) => compareByKey(a, b, sort.key, sort.dir)),
      [rows, sort]
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tableArgs.dataBehavior === 'realtime' && (
          <ConnectionBadge status={connectionBadge} />
        )}
        <Table<Device>
          {...tableArgs}
          columns={columns}
          data={sorted}
          sortKey={sort.key}
          sortDir={sort.dir}
          onSort={(k, d) => setSort({ key: k, dir: d })}
        />
      </div>
    );
  },
};

