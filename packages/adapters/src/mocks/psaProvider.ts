import type { IntegrationProvider } from '../providers';

export const psaProvider: IntegrationProvider = {
  id: 'psa',
  displayName: 'Best PSA',
  category: 'psa',
  capabilities: { tickets: true, comments: true },
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
    return { items: 15, lastSync: Date.now() - 1000 * 60 * 15 };
  },
};
