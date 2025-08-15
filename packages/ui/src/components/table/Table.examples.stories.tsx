import { useState, useMemo, useEffect, useRef, startTransition } from 'react';
import type { Meta } from '@storybook/react';
import { Table } from './Table';
import type { ColumnDef, SortDir } from './types';
import { compareByKey } from './sort';

export default {
  title: 'Components/Table/Examples',
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { disableOtherRules: ['color-contrast'] }
  }
} satisfies Meta;

type Device = {
  id: string;
  name: string;
  os: 'Windows' | 'macOS' | 'Linux';
  status: 'online' | 'offline' | 'warning';
  lastSeen: number; // epoch ms
};

const columns: ColumnDef<Device>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'os', header: 'OS', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  {
    key: 'lastSeen',
    header: 'Last Seen',
    sortable: true,
    render: (r) => new Date(r.lastSeen).toLocaleString()
  }
];

function seedRand(seed = 1) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function makeDevices(count = 2000, seed = 1): Device[] {
  const rand = seedRand(seed);
  const oses: Device['os'][] = ['Windows', 'macOS', 'Linux'];
  const statuses: Device['status'][] = ['online', 'offline', 'warning'];
  const base = 1700000000000;
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Device ${i + 1}`,
    os: oses[Math.floor(rand() * oses.length)],
    status: statuses[Math.floor(rand() * statuses.length)],
    lastSeen: base - Math.floor(rand() * 1e7)
  }));
}

export const BatchVirtualized = ({
  count = 5000,
  seed = 1,
  density = 'cozy',
  variant = 'surface'
}: {
  count?: number;
  seed?: number;
  density?: 'compact' | 'cozy' | 'comfortable';
  variant?: 'surface' | 'plain';
}) => {
  const data = useMemo(() => makeDevices(count, seed), [count, seed]);
  const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({
    key: 'name',
    dir: 'asc'
  });
  const sorted = useMemo(
    () => data.slice().sort((a, b) => compareByKey(a, b, sort.key, sort.dir)),
    [data, sort]
  );
  return (
    <Table<Device>
      dataBehavior="batch"
      renderBehavior="virtualized"
      height={480}
      rowHeight={40}
      columns={columns}
      data={sorted}
      sortKey={sort.key}
      sortDir={sort.dir}
      onSort={(k, d) => setSort({ key: k, dir: d })}
      zebra
      stickyHeader
      density={density}
      variant={variant}
      getRowId={(r) => r.id}
    />
  );
};
BatchVirtualized.args = { count: 5000, seed: 1, density: 'cozy', variant: 'surface' };
BatchVirtualized.argTypes = {
  density: { control: 'select', options: ['compact', 'cozy', 'comfortable'] },
  variant: { control: 'select', options: ['surface', 'plain'] }
};
BatchVirtualized.parameters = { screenshot: { variants: ['default'] } };

const ConnectionBadge = ({ open }: { open: boolean }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: 4,
      background: open ? '#d1fae5' : '#fee2e2',
      color: open ? '#065f46' : '#991b1b'
    }}
  >
    {open ? 'Open' : 'Connecting'}
  </span>
);

export const RealtimeStandard = ({ smoothing = false }: { smoothing?: boolean }) => {
  const [rows, setRows] = useState(() => makeDevices(500, 2));
  const buffer = useRef(rows);
  const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({
    key: 'name',
    dir: 'asc'
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    buffer.current = rows;
  }, [rows]);

  useEffect(() => {
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
          lastSeen: Date.now()
        };
      }
      if (!flushTimer) {
        flushTimer = setTimeout(() => {
          startTransition(() => setRows([...buffer.current]));
          flushTimer = null;
        }, smoothing ? 250 : 0);
      }
    }, 250);
    return () => {
      clearInterval(interval);
      if (flushTimer) clearTimeout(flushTimer);
    };
  }, [smoothing]);

  const sortedView = useMemo(
    () => rows.slice().sort((a, b) => compareByKey(a, b, sort.key, sort.dir)),
    [rows, sort]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ConnectionBadge open={open} />
      <Table<Device>
        dataBehavior="realtime"
        renderBehavior="standard"
        columns={columns}
        data={sortedView}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={(k, d) => setSort({ key: k, dir: d })}
        zebra
        stickyHeader
        density="comfortable"
        variant="surface"
        getRowId={(r) => r.id}
      />
    </div>
  );
};
RealtimeStandard.args = { smoothing: false };
RealtimeStandard.argTypes = {
  smoothing: { control: 'boolean', name: 'Jitter smoothing' }
};
