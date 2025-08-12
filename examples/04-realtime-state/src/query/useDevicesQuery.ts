import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { makeDevices } from '../generateDevices';
import type { Device, DeviceUpdate } from '../types';
import { subscribe, ConnectionStatus } from '../client/stream';

export function applyBatch(prev: Device[], batch: DeviceUpdate[]): Device[] {
  if (!prev) return [];
  const map = new Map(prev.map((d, i) => [d.id, i]));
  const next = [...prev];
  for (const u of batch) {
    const idx = map.get(u.id);
    if (idx !== undefined) {
      next[idx] = { ...next[idx], ...u.patch };
    }
  }
  return next;
}

export function useDevicesQuery(bufferMs: number) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastBatch, setLastBatch] = useState(0);
  const [lastFlush, setLastFlush] = useState(0);

  const query = useQuery<Device[]>({
    queryKey: ['devices'],
    queryFn: async () => makeDevices(2000)
  });

  const [subRef, setSubRef] = useState<ReturnType<typeof subscribe> | null>(null);

  useEffect(() => {
    const start = performance.now();
    const sub = subscribe({
      bufferMs,
      onStatus: setStatus,
      onBatch: (batch) => {
        setLastBatch(batch.length);
        setLastFlush(performance.now() - start);
        qc.setQueryData<Device[]>(['devices'], (prev = []) => applyBatch(prev, batch));
      }
    });
    setSubRef(sub);
    return () => sub.close();
  }, [bufferMs, qc]);

  const simulateError = () => subRef?.simulateError();

  return { ...query, status, lastBatch, lastFlush, simulateError };
}
