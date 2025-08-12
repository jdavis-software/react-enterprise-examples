import type { IntegrationProvider } from '../providers';

export const backupProvider: IntegrationProvider = {
  id: 'backup',
  displayName: 'Acme Backup',
  category: 'backup',
  capabilities: { snapshots: true, immutability: false },
  status: 'disconnected',
  async connect() {
    await new Promise((res) => setTimeout(res, 300));
    this.status = 'connected';
  },
  async disconnect() {
    await new Promise((res) => setTimeout(res, 200));
    this.status = 'disconnected';
  },
  async fetchSummary() {
    await new Promise((res) => setTimeout(res, 200));
    return { items: 42, lastSync: Date.now() - 1000 * 60 * 60 };
  },
};
