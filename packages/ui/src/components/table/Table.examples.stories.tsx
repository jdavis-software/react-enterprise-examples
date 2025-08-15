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
  density,
  variant,
  height,
  rowHeight,
  renderBehavior,
  dataBehavior,
}: {
  count?: number;
  seed?: number;
  density: 'compact' | 'cozy' | 'comfortable';
  variant: 'surface' | 'plain';
  height: number;
  rowHeight: number;
  renderBehavior: 'virtualized';
  dataBehavior: 'batch';
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
      dataBehavior={dataBehavior}
      renderBehavior={renderBehavior}
      height={height}
      rowHeight={rowHeight}
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
BatchVirtualized.args = {
  count: 5000,
  seed: 1,
  density: 'cozy',
  variant: 'surface',
  height: 480,
  rowHeight: 40,
  renderBehavior: 'virtualized',
  dataBehavior: 'batch'
};
BatchVirtualized.argTypes = {
  density: { control: 'select', options: ['compact', 'cozy', 'comfortable'] },
  variant: { control: 'select', options: ['surface', 'plain'] },
  height: {
    control: { type: 'number', min: 240, max: 800, step: 20 },
    if: { arg: 'renderBehavior', eq: 'virtualized' }
  },
  rowHeight: {
    control: { type: 'number', min: 28, max: 56, step: 2 },
    if: { arg: 'renderBehavior', eq: 'virtualized' }
  },
  renderBehavior: { table: { disable: true } },
  dataBehavior: { table: { disable: true } }
};
BatchVirtualized.parameters = { screenshot: { variants: ['default'] } };

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
          : '#991b1b'
    }}
  >
    {status}
  </span>
);

export const RealtimeStandard = ({
  jitterSmoothing,
  connectionBadge,
  renderBehavior,
  dataBehavior
}: {
  jitterSmoothing: boolean;
  connectionBadge: 'Connecting' | 'Open' | 'Closed' | 'Error';
  renderBehavior: 'standard';
  dataBehavior: 'realtime';
}) => {
  const [rows, setRows] = useState(() => makeDevices(500, 2));
  const buffer = useRef(rows);
  const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({
    key: 'name',
    dir: 'asc'
  });

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
        }, jitterSmoothing ? 250 : 0);
      }
    }, 250);
    return () => {
      clearInterval(interval);
      if (flushTimer) clearTimeout(flushTimer);
    };
  }, [jitterSmoothing]);

  const sortedView = useMemo(
    () => rows.slice().sort((a, b) => compareByKey(a, b, sort.key, sort.dir)),
    [rows, sort]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ConnectionBadge status={connectionBadge} />
      <Table<Device>
        dataBehavior={dataBehavior}
        renderBehavior={renderBehavior}
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
RealtimeStandard.args = {
  jitterSmoothing: false,
  connectionBadge: 'Connecting',
  renderBehavior: 'standard',
  dataBehavior: 'realtime'
};
RealtimeStandard.argTypes = {
  jitterSmoothing: {
    control: 'boolean',
    name: 'Jitter smoothing',
    if: { arg: 'dataBehavior', eq: 'realtime' }
  },
  connectionBadge: {
    control: 'select',
    options: ['Connecting', 'Open', 'Closed', 'Error'],
    if: { arg: 'dataBehavior', eq: 'realtime' }
  },
  renderBehavior: { table: { disable: true } },
  dataBehavior: { table: { disable: true } }
};
