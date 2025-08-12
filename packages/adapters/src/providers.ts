export interface IntegrationProvider {
  id: string;
  displayName: string;
  category: 'backup' | 'psa' | 'security' | 'monitoring';
  capabilities: Record<string, boolean>;
  status: 'connected' | 'disconnected' | 'error';
  connect(input: Record<string, any>): Promise<void>;
  disconnect(): Promise<void>;
  fetchSummary(): Promise<{ items: number; lastSync: number }>;
}
