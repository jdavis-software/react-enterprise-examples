import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '@react-enterprise-examples/ui';
import type { IntegrationProvider } from '../../../packages/adapters/src/providers';
import { SetupWizard } from './SetupWizard';
import './IntegrationCard.scss';

interface Props {
  provider: IntegrationProvider;
  disabled?: boolean;
  onChange(): void;
}

export function IntegrationCard({ provider, disabled, onChange }: Props) {
  const [summary, setSummary] = useState<{ items: number; lastSync: number } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (provider.status === 'connected') {
      provider.fetchSummary().then((s) => {
        if (!cancelled) setSummary(s);
      });
    } else {
      setSummary(null);
    }
    return () => {
      cancelled = true;
    };
  }, [provider.status, provider]);

  const statusVariant =
    provider.status === 'connected'
      ? 'primary'
      : provider.status === 'error'
      ? 'danger'
      : 'subtle';

  return (
    <Card className={`integration-card ${disabled ? 'disabled' : ''}`}>
      <h3>{provider.displayName}</h3>
      <Badge variant={statusVariant}>{provider.status}</Badge>
      {provider.status === 'connected' && summary && (
        <p>
          {summary.items} items • Last sync {new Date(summary.lastSync).toLocaleString()}
        </p>
      )}
      {provider.status === 'connected' && provider.capabilities.snapshots && (
        <a href="#">Snapshots</a>
      )}
      <div className="actions">
        {disabled ? (
          <Badge variant="subtle">Disabled</Badge>
        ) : provider.status === 'connected' ? (
          <Button
            size="sm"
            onClick={async () => {
              await provider.disconnect();
              onChange();
            }}
          >
            Disconnect
          </Button>
        ) : provider.status === 'error' ? (
          <Button
            size="sm"
            onClick={async () => {
              provider.status = 'disconnected';
              await provider.connect({});
              onChange();
            }}
          >
            Retry
          </Button>
        ) : (
          <Button size="sm" onClick={() => setOpen(true)}>
            Connect
          </Button>
        )}
      </div>
      {open && (
        <SetupWizard
          provider={provider}
          onClose={() => setOpen(false)}
          onConnected={() => {
            setOpen(false);
            onChange();
          }}
        />
      )}
    </Card>
  );
}
