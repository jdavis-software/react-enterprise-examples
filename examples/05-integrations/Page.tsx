import React, { useState } from 'react';
import '../../packages/ui/src/tokens.scss';
import { Input, Switch } from '@react-enterprise-examples/ui';
import type { IntegrationProvider } from '../../packages/adapters/src/providers';
import {
  backupProvider,
  psaProvider,
  securityProvider,
  monitoringProvider
} from '../../packages/adapters/src/mocks';
import { featureFlags } from '../../apps/demo-app/src/config/featureFlags';
import { IntegrationCard } from './src/IntegrationCard';
import './src/IntegrationsPage.scss';

const allProviders: IntegrationProvider[] = [
  backupProvider,
  psaProvider,
  securityProvider,
  monitoringProvider
];

export function filterByFeatureFlags(
  list: IntegrationProvider[],
  flags: Record<string, boolean>,
  showDisabled = false
) {
  return list.filter((p) => showDisabled || flags[p.id] !== false);
}

export function Page() {
  const [providers, setProviders] = useState<IntegrationProvider[]>(allProviders);
  const [showDisabled, setShowDisabled] = useState(false);
  const [search, setSearch] = useState('');

  const visible = filterByFeatureFlags(
    providers,
    featureFlags.integrations || {},
    showDisabled
  ).filter(
    (p) =>
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="controls">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <div className="toggle-disabled">
          <Switch
            aria-label="Show Disabled"
            checked={showDisabled}
            onChange={setShowDisabled}
          />
          <span>Show Disabled</span>
        </div>
      </div>
      <div className="integrations-grid">
        {visible.map((p) => (
          <IntegrationCard
            key={p.id}
            provider={p}
            disabled={featureFlags.integrations?.[p.id] === false}
            onChange={() => setProviders([...providers])}
          />
        ))}
      </div>
    </div>
  );
}
