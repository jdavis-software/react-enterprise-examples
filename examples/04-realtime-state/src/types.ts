export type Device = {
  id: string;
  name: string;
  os: 'Windows' | 'macOS' | 'Linux';
  status: 'online' | 'offline' | 'warning';
  lastSeen: number;
};

export type DeviceUpdate = {
  id: string;
  patch: Partial<Device>;
};
