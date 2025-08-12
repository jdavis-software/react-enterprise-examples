import type { IntegrationProvider } from '../providers';

export const securityProvider: IntegrationProvider = {
  id: 'security',
  displayName: 'Secure Co',
  category: 'security',
  capabilities: { alerts: true, snapshots: false },
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
    return { items: 7, lastSync: Date.now() - 1000 * 60 * 30 };
  },
};
