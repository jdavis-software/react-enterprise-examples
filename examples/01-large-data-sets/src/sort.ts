import type { Device } from './generateData';
import { compareByKey } from '@react-enterprise-examples/ui';

export type SortKey = keyof Device;
export type SortDir = 'asc' | 'desc';

export function sortDevices(items: Device[], sortKey: SortKey, sortDir: SortDir): Device[] {
  return items.slice().sort((a, b) => compareByKey(a, b, sortKey, sortDir));
}
