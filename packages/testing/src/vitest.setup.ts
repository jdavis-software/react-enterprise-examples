import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './msw/server';

expect.extend(matchers);

beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

export async function withFakeTimers(cb: () => void | Promise<void>) {
  vi.useFakeTimers();
  try {
    await cb();
  } finally {
    vi.useRealTimers();
  }
}

class FakeWorker {
  onmessage: ((e: MessageEvent<any>) => void) | null = null;
  postMessage(data: any) {
    this.onmessage?.({ data } as any);
  }
  addEventListener(_type: string, cb: any) {
    this.onmessage = cb;
  }
  removeEventListener() {}
  terminate() {}
}

(globalThis as any).Worker = FakeWorker as any;
