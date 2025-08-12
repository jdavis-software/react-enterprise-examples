import type { Device } from './generateData';

export type SortKey = 'name' | 'os' | 'status' | 'lastSeen';
export type SortDir = 'asc' | 'desc';

export function sortDevices(items: Device[], sortKey: SortKey, sortDir: SortDir): Device[] {
  const sorted = [...items].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}
