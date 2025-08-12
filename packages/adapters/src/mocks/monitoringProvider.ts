import type { IntegrationProvider } from '../providers';

export const monitoringProvider: IntegrationProvider = {
  id: 'monitoring',
  displayName: 'MonitorIt',
  category: 'monitoring',
  capabilities: { metrics: true, snapshots: true },
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
    return { items: 100, lastSync: Date.now() - 1000 * 60 * 5 };
  },
};
