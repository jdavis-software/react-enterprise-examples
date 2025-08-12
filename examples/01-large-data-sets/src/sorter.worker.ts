import type { Device } from './generateData';
import { sortDevices, SortDir, SortKey } from './sort';

self.onmessage = (e: MessageEvent<{ sortKey: SortKey; sortDir: SortDir; items: Device[] }>) => {
  const { sortKey, sortDir, items } = e.data;
  const sorted = sortDevices(items, sortKey, sortDir);
  postMessage(sorted);
};
