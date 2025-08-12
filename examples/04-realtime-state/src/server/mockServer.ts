import { makeDevices, statusOptions } from '../generateDevices';
import type { Device, DeviceUpdate } from '../types';

export type MockSocket = {
  onmessage?: (ev: MessageEvent) => void;
  onopen?: () => void;
  onclose?: () => void;
  readyState: number;
  send: (msg: string) => void;
  close: () => void;
};

// States roughly mirror browser WebSocket constants
const CONNECTING = 0;
const OPEN = 1;
const CLOSED = 3;

export function createMockWebSocket(initial: Device[] = makeDevices(2000)) {
  let state = CONNECTING;
  const listeners: Partial<MockSocket> = {};
  const socket: MockSocket = {
    get onmessage() {
      return listeners.onmessage;
    },
    set onmessage(fn) {
      listeners.onmessage = fn;
    },
    get onopen() {
      return listeners.onopen;
    },
    set onopen(fn) {
      listeners.onopen = fn;
    },
    get onclose() {
      return listeners.onclose;
    },
    set onclose(fn) {
      listeners.onclose = fn;
    },
    readyState: state,
    send(msg: string) {
      // commands: { id, patch }
      try {
        const { id, patch } = JSON.parse(msg) as DeviceUpdate;
        const device = initial.find((d) => d.id === id);
        if (device) Object.assign(device, patch);
      } catch {
        /* noop */
      }
    },
    close() {
      cleanup();
    }
  } as MockSocket;

  let interval: NodeJS.Timeout | undefined;
  let disconnectTimer: NodeJS.Timeout | undefined;

  function cleanup() {
    state = CLOSED;
    socket.readyState = CLOSED;
    if (interval) clearInterval(interval);
    if (disconnectTimer) clearTimeout(disconnectTimer);
    listeners.onclose?.();
  }

  function randomPatch(device: Device): DeviceUpdate {
    return {
      id: device.id,
      patch: {
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        lastSeen: Date.now()
      }
    };
  }

  function start() {
    state = OPEN;
    socket.readyState = OPEN;
    listeners.onopen?.();

    interval = setInterval(() => {
      const batch: DeviceUpdate[] = [];
      const count = 2 + Math.floor(Math.random() * 18);
      for (let i = 0; i < count; i++) {
        const device = initial[Math.floor(Math.random() * initial.length)];
        batch.push(randomPatch(device));
      }
      listeners.onmessage?.(new MessageEvent('message', { data: JSON.stringify(batch) }));
    }, 200);

    // occasional disconnect
    disconnectTimer = setTimeout(() => {
      cleanup();
    }, 5000 + Math.random() * 5000);
  }

  // simulate async open
  setTimeout(start, 10);

  return { socket, close: cleanup };
}
