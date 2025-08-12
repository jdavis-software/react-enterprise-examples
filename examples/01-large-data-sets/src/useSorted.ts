import { useEffect, useRef, useState } from 'react';
import type { Device } from './generateData';
import { sortDevices, SortDir, SortKey } from './sort';

export function useSorted(items: Device[], sortKey: SortKey, sortDir: SortDir) {
  const workerRef = useRef<Worker>();
  const [sorted, setSorted] = useState<Device[]>([]);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./sorter.worker.ts', import.meta.url), {
      type: 'module'
    });
    const worker = workerRef.current;
    const handler = (e: MessageEvent<Device[]>) => setSorted(e.data);
    worker.addEventListener('message', handler);
    return () => {
      worker.removeEventListener('message', handler);
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (items.length >= 2000 && workerRef.current) {
      workerRef.current.postMessage({ sortKey, sortDir, items });
    } else {
      setSorted(sortDevices(items, sortKey, sortDir));
    }
  }, [items, sortKey, sortDir]);

  return sorted;
}
