import type { DeviceUpdate } from '../types';
import { createMockWebSocket } from '../server/mockServer';
import { createMockEventSource } from '../server/sse';

export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

export function subscribe({
  onBatch,
  onStatus,
  bufferMs = 250
}: {
  onBatch: (batch: DeviceUpdate[]) => void;
  onStatus: (s: ConnectionStatus) => void;
  bufferMs?: number;
}) {
  let buffer: DeviceUpdate[] = [];
  let flushTimer: NodeJS.Timeout | undefined;
  let flushStart = 0;
  let backoff = 250;
  let socket: ReturnType<typeof createMockWebSocket> | null = null;
  let es: ReturnType<typeof createMockEventSource> | null = null;
  let closed = false;

  function scheduleFlush() {
    if (bufferMs === 0) {
      onBatch(buffer);
      buffer = [];
      flushStart = performance.now();
      return;
    }
    if (!flushTimer) {
      flushStart = performance.now();
      flushTimer = setTimeout(() => {
        onBatch(buffer);
        buffer = [];
        flushTimer = undefined;
      }, bufferMs);
    }
  }

  function connectWS() {
    onStatus('connecting');
    try {
      socket = createMockWebSocket();
      const s = socket.socket;
      s.onopen = () => {
        onStatus('open');
        backoff = 250;
      };
      s.onmessage = (ev) => {
        const batch = JSON.parse(ev.data) as DeviceUpdate[];
        buffer.push(...batch);
        scheduleFlush();
      };
      s.onclose = () => {
        onStatus('closed');
        if (!closed) reconnect();
      };
    } catch {
      onStatus('error');
      connectSSE();
    }
  }

  function connectSSE() {
    onStatus('connecting');
    try {
      es = createMockEventSource();
      es.onmessage = (ev) => {
        const batch = JSON.parse(ev.data) as DeviceUpdate[];
        buffer.push(...batch);
        scheduleFlush();
      };
      es.onerror = () => {
        onStatus('error');
        if (!closed) reconnect();
      };
      onStatus('open');
      backoff = 250;
    } catch {
      onStatus('error');
    }
  }

  function reconnect() {
    if (closed) return;
    const timeout = backoff;
    backoff = Math.min(backoff * 2, 2000);
    setTimeout(() => {
      socket = null;
      es = null;
      connectWS();
    }, timeout);
  }

  connectWS();

  return {
    close() {
      closed = true;
      if (socket) socket.close();
      if (es) es.close();
      if (flushTimer) clearTimeout(flushTimer);
    },
    simulateError() {
      if (socket) socket.close();
      if (es) es.close();
    }
  };
}
