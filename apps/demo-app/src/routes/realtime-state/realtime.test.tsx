import { describe, it, expect } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

type Device = { id: string; name: string; os: string; status: string; lastSeen: number };
const makeDevices = (n: number): Device[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${i}`, name: `d${i}`, os: 'os', status: 'offline', lastSeen: 0 }));

function applyBatch(prev: Device[], batch: { id: string; patch: Partial<Device> }[]): Device[] {
  const map = new Map(prev.map((d, i) => [d.id, i]));
  const next = [...prev];
  for (const u of batch) {
    const idx = map.get(u.id);
    if (idx !== undefined) next[idx] = { ...next[idx], ...u.patch };
  }
  return next;
}

describe('realtime state', () => {
  it('applyBatch updates without reordering', () => {
    const devices = makeDevices(10);
    const batch = [{ id: '5', patch: { status: 'online' as const } }];
    const next = applyBatch(devices, batch);
    expect(next).toHaveLength(devices.length);
    expect(next[5].status).toBe('online');
    expect(next.map((d) => d.id)).toEqual(devices.map((d) => d.id));
  });

  it('optimistic update rolls back on error', async () => {
    const qc = new QueryClient();
    const devices = makeDevices(2);
    qc.setQueryData(['devices'], devices);
    const mutate = async () => {
      qc.setQueryData(['devices'], (prev: any) => applyBatch(prev, [{ id: '1', patch: { status: 'online' } }]));
      throw new Error('fail');
    };
    await mutate().catch(() => {
      qc.setQueryData(['devices'], devices);
    });
    const after = qc.getQueryData(['devices']) as typeof devices;
    expect(after[1].status).toBe(devices[1].status);
  });
});
