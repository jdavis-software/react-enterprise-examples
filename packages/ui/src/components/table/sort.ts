export function nextDir(dir?: 'asc' | 'desc'): 'asc' | 'desc' {
  return dir === 'asc' ? 'desc' : 'asc';
}

export function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date) a = a.getTime();
  if (b instanceof Date) b = b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function compareByKey<T>(a: T, b: T, key: keyof T, dir: 'asc' | 'desc') {
  const v = compareValues((a as any)[key], (b as any)[key]);
  return dir === 'asc' ? v : -v;
}
