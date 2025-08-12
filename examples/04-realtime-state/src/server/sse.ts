import type { Device, DeviceUpdate } from '../types';
import { makeDevices, statusOptions } from '../generateDevices';

export type MockEventSource = {
  onmessage?: (ev: MessageEvent) => void;
  onerror?: () => void;
  close: () => void;
};

export function createMockEventSource(initial: Device[] = makeDevices(2000)): MockEventSource {
  const es: MockEventSource = {
    onmessage: undefined,
    onerror: undefined,
    close() {
      if (interval) clearInterval(interval);
    }
  };

  function randomPatch(device: Device): DeviceUpdate {
    return {
      id: device.id,
      patch: {
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        lastSeen: Date.now()
      }
    };
  }

  const interval = setInterval(() => {
    try {
      const batch: DeviceUpdate[] = [];
      const count = 2 + Math.floor(Math.random() * 18);
      for (let i = 0; i < count; i++) {
        const device = initial[Math.floor(Math.random() * initial.length)];
        batch.push(randomPatch(device));
      }
      es.onmessage?.(new MessageEvent('message', { data: JSON.stringify(batch) }));
    } catch {
      es.onerror?.();
    }
  }, 200);

  return es;
}
