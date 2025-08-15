import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge, ColumnDef, Table } from '@react-enterprise-examples/ui';
import { makeDevices, osOptions, statusOptions, Device } from './src/generateData';
import { useSorted } from './src/useSorted';
import type { SortDir, SortKey } from './src/sort';
import '../../packages/ui/src/tokens.scss';

function useQueryParam<T extends string>(key: string, defaultValue: T): [T, (v: T) => void] {
  const [params, setParams] = useSearchParams();
  const value = (params.get(key) as T) || defaultValue;
  const setValue = (v: T) => {
    const next = new URLSearchParams(params);
    if (!v || v === defaultValue) next.delete(key); else next.set(key, v);
    setParams(next, { replace: true });
  };
  return [value, setValue];
}

export function Page({ initialDevices }: { initialDevices?: Device[] }) {
  const [devices, setDevices] = useState<Device[]>(() => initialDevices ?? makeDevices(50_000));
  const [search, setSearch] = useState('');
  const searchRef = useRef<NodeJS.Timeout>();
  const [params, setParams] = useSearchParams();
  const [os, setOs] = useQueryParam<'all' | (typeof osOptions)[number]>('os', 'all');
  const [status, setStatus] = useQueryParam<'all' | (typeof statusOptions)[number]>('status', 'all');
  const [sortKey, setSortKey] = useQueryParam<SortKey>('sort', 'name');
  const [sortDir, setSortDir] = useQueryParam<SortDir>('dir', 'asc');

  const formatRelative = (ms: number) => {
    const diff = Date.now() - ms;
    const mins = Math.floor(diff / 60000);
    return `${mins}m ago`;
  };

  const columns: ColumnDef<Device>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'os', header: 'OS', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (d) => (
        <Badge variant={d.status === 'online' ? 'success' : d.status === 'warning' ? 'warning' : 'neutral'}>{d.status}</Badge>
      )
    },
    {
      key: 'lastSeen',
      header: 'Last Seen',
      sortable: true,
      render: (d) => formatRelative(d.lastSeen)
    }
  ];

  useEffect(() => {
    setSearch(params.get('q') || '');
  }, []);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (value) next.set('q', value); else next.delete('q');
      setParams(next, { replace: true });
    }, 150);
  };

  const filtered = useMemo(() => {
    const q = (params.get('q') || '').toLowerCase();
    return devices.filter((d) => {
      if (q && !d.name.toLowerCase().includes(q)) return false;
      if (os !== 'all' && d.os !== os) return false;
      if (status !== 'all' && d.status !== status) return false;
      return true;
    });
  }, [devices, params, os, status]);

  const t0 = performance.now();
  const sorted = useSorted(filtered, sortKey, sortDir);
  const renderTime = performance.now() - t0;

  const handleSort = (key: SortKey, dir: SortDir) => {
    setSortKey(key);
    setSortDir(dir);
  };

  // live updates
  useEffect(() => {
    const buffer: { index: number; device: Device }[] = [];
    const updateTimer = setInterval(() => {
      for (let i = 0; i < 50; i++) {
        const idx = Math.floor(Math.random() * devices.length);
        const d = devices[idx];
        buffer.push({
          index: idx,
          device: { ...d, status: statusOptions[Math.floor(Math.random() * statusOptions.length)], lastSeen: Date.now() }
        });
      }
    }, 1000);
    const flush = setInterval(() => {
      if (buffer.length) {
        setDevices((prev) => {
          const copy = [...prev];
          for (const u of buffer) copy[u.index] = u.device;
          buffer.length = 0;
          return copy;
        });
      }
    }, 250);
    return () => {
      clearInterval(updateTimer);
      clearInterval(flush);
    };
  }, [devices.length]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          placeholder="Search devices"
          value={search}
          onChange={onSearchChange}
        />
        <select value={os} onChange={(e) => setOs(e.target.value as any)}>
          <option value="all">All OS</option>
          {osOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="all">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <Badge variant="subtle">
          Showing {sorted.length} of {devices.length} devices | render {renderTime.toFixed(0)}ms
        </Badge>
      </div>
      <Table<Device>
        dataBehavior="batch"
        renderBehavior="virtualized"
        height={600}
        rowHeight={40}
        columns={columns}
        data={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        zebra
        stickyHeader
        density="cozy"
        variant="surface"
        getRowId={(r) => r.id}
      />
    </div>
  );
}
