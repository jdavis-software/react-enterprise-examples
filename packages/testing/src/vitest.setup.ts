import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(cleanup);

class FakeWorker {
  onmessage: ((e: MessageEvent<any>) => void) | null = null;
  postMessage(data: any) {
    const { sortKey, sortDir, items } = data;
    const sorted = [...items].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    this.onmessage?.({ data: sorted } as any);
  }
  addEventListener(_type: string, cb: any) {
    this.onmessage = cb;
  }
  removeEventListener() {}
  terminate() {}
}

(globalThis as any).Worker = FakeWorker as any;
