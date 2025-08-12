import { describe, it, expect, expectTypeOf } from 'vitest';
import { backupProvider } from '../mocks/backupProvider';
import { monitoringProvider } from '../mocks/monitoringProvider';
import { psaProvider } from '../mocks/psaProvider';
import { securityProvider } from '../mocks/securityProvider';
import type { IntegrationProvider } from '../providers';

const providers = [backupProvider, monitoringProvider, psaProvider, securityProvider];

describe.each(providers)('$id provider', (provider) => {
  it('implements IntegrationProvider contract', async () => {
    expectTypeOf(provider).toMatchTypeOf<IntegrationProvider>();
    expect(typeof provider.connect).toBe('function');
    expect(typeof provider.disconnect).toBe('function');
    const summary = await provider.fetchSummary();
    expect(typeof summary.items).toBe('number');
    expect(typeof summary.lastSync).toBe('number');
  });
});
