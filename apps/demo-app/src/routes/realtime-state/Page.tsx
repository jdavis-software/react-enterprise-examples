import React, { useMemo, useState } from 'react';
import { Badge, Button } from '@react-enterprise-examples/ui';
import { useDevicesQuery } from '@examples/04-realtime-state/src/query/useDevicesQuery';
import { osOptions, statusOptions } from '@examples/04-realtime-state/src/generateDevices';
import '@examples/04-realtime-state/styles/_realtime.scss';
import '@react-enterprise-examples/ui/tokens.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const qc = useQueryClient();
  const { data: devices = [], status, lastBatch, lastFlush, simulateError } = useDevicesQuery(buffer);

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((res, rej) => setTimeout(() => (Math.random() > 0.5 ? res(null) : rej(new Error('fail'))), 300));
    },
    onMutate: async (id: string) => {
      qc.setQueryData<Device[]>(['devices'], (prev = []) => prev.map((d) => (d.id === id ? { ...d, status: 'online' } : d)));
      return { id };
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ['devices'] });
    }
  });

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (os !== 'all' && d.os !== os) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      return true;
    });
  }, [devices, search, os, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const connectVariant = status === 'open' ? 'primary' : status === 'connecting' ? 'warning' : 'danger';

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
      <table className="realtime-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Last Seen</th>
            <th>Quick</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.id} className={selected.has(d.id) ? 'selected' : ''}>
              <td><input type="checkbox" checked={selected.has(d.id)} onChange={() => toggleSelect(d.id)} /></td>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td><Badge variant={d.status === 'online' ? 'primary' : d.status === 'warning' ? 'warning' : 'danger'}>{d.status}</Badge></td>
              <td>{relative(d.lastSeen)}</td>
              <td><Button size="sm" onClick={() => mutation.mutate(d.id)}>Go Online</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer style={{ marginTop: '0.5rem' }}>
        <Badge variant="subtle">{filtered.length} shown / {devices.length} total | last batch {lastBatch} items / last flush {lastFlush.toFixed(0)}ms</Badge>
      </footer>
    </div>
  );
}
