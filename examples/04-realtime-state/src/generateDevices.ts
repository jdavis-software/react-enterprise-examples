import type { Device } from './types';

export const osOptions = ['Windows', 'macOS', 'Linux'] as const;
export const statusOptions = ['online', 'offline', 'warning'] as const;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeDevices(count: number): Device[] {
  const rand = mulberry32(42);
  const devices: Device[] = [];
  for (let i = 0; i < count; i++) {
    const id = `${i}`;
    const name = `Device ${i + 1}`;
    const os = osOptions[Math.floor(rand() * osOptions.length)];
    const status = statusOptions[Math.floor(rand() * statusOptions.length)];
    const lastSeen = Date.now() - Math.floor(rand() * 1000 * 60 * 60 * 24);
    devices.push({ id, name, os, status, lastSeen });
  }
  return devices;
}
