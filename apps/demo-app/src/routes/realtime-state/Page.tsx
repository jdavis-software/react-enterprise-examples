import React, { useMemo, useState } from 'react';
import { Badge, Button, Table, ColumnDef, SortDir, compareByKey } from '@react-enterprise-examples/ui';
import { useDevicesQuery } from '@examples/04-realtime-state/src/query/useDevicesQuery';
import { osOptions, statusOptions } from '@examples/04-realtime-state/src/generateDevices';
import '@examples/04-realtime-state/styles/_realtime.scss';
import '@react-enterprise-examples/ui/tokens.scss';
import type { Device } from '../../../../examples/04-realtime-state/src/types';

function relative(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  return `${mins} mins ago`;
}

export function Page() {
  const [buffer, setBuffer] = useState(250);
  const [search, setSearch] = useState('');
  const [os, setOs] = useState<'all' | (typeof osOptions)[number]>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | (typeof statusOptions)[number]>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data: devices = [], status, lastBatch, lastFlush, simulateError } = useDevicesQuery(buffer);

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (os !== 'all' && d.os !== os) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      return true;
    });
  }, [devices, search, os, statusFilter]);

  const [sort, setSort] = useState<{ key: keyof Device; dir: SortDir }>({ key: 'id', dir: 'asc' });

  const sorted = useMemo(() => {
    return filtered.slice().sort((a, b) => compareByKey(a, b, sort.key, sort.dir));
  }, [filtered, sort]);

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const columns: ColumnDef<Device>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (d) => (
        <Badge variant={d.status === 'online' ? 'success' : d.status === 'warning' ? 'warning' : 'neutral'}>{d.status}</Badge>
      )
    },
    { key: 'lastSeen', header: 'Last Seen', sortable: true, render: (d) => relative(d.lastSeen) }
  ];

  const connectVariant = status === 'open' ? 'success' : status === 'connecting' ? 'warning' : 'neutral';

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Badge variant={connectVariant}>{status.toUpperCase()}</Badge>
        <label>
          <input type="checkbox" checked={buffer === 0} onChange={(e) => setBuffer(e.target.checked ? 0 : 250)} />
          jitter smoothing
        </label>
        <Button variant="danger" onClick={() => simulateError()}>Simulate Error</Button>
      </div>
      <div style={{ margin: '0.5rem 0', display: 'flex', gap: '0.5rem' }}>
        <input placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={os} onChange={(e) => setOs(e.target.value as any)}>
          <option value="all">All OS</option>
          {osOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
          <option value="all">All Status</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <Table<Device>
        mode="virtual"
        height={400}
        rowHeight={40}
        columns={columns}
        data={sorted}
        sortKey={sort.key}
        sortDir={sort.dir}
        onSort={(key, dir) => setSort({ key, dir })}
        zebra
        density="cozy"
        bordered
        selectable
        getRowId={(d) => d.id}
        isRowSelected={(d) => selected.has(d.id)}
        onRowSelect={(row) => toggleSelect(row.id)}
      />
      <footer style={{ marginTop: '0.5rem' }}>
        <Badge variant="subtle">{sorted.length} shown / {devices.length} total | last batch {lastBatch} items / last flush {lastFlush.toFixed(0)}ms</Badge>
      </footer>
    </div>
  );
}
