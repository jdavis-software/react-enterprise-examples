import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect, vi } from 'vitest';
import { IntegrationCard } from '../src/IntegrationCard';
import { backupProvider, securityProvider, psaProvider } from '../../../packages/adapters/src/mocks';
import { filterByFeatureFlags } from '../Page';

test('IntegrationCard renders provider name and status', () => {
  const provider = { ...backupProvider, status: 'disconnected' as const };
  render(<IntegrationCard provider={provider} onChange={() => {}} />);
  expect(screen.getByText(/Acme Backup/)).toBeInTheDocument();
  expect(screen.getByText(/disconnected/)).toBeInTheDocument();
});

test('connect flow calls connect and updates status', async () => {
  const provider = { ...backupProvider, status: 'disconnected' as const, connect: vi.fn(backupProvider.connect) };
  render(<IntegrationCard provider={provider} onChange={() => {}} />);
  await userEvent.click(screen.getByRole('button', { name: /connect/i }));
  await userEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: /next/i }));
  await userEvent.type(screen.getByLabelText(/api key/i), '123');
  await userEvent.click(screen.getByRole('button', { name: /next/i }));
  const dialog = screen.getByRole('dialog');
  await userEvent.click(within(dialog).getByRole('button', { name: /connect/i }));
  await screen.findByText(/connected/);
  expect(provider.connect).toHaveBeenCalled();
});

test('feature flags filter providers correctly', () => {
  const list = [backupProvider, psaProvider, securityProvider];
  const flags = { backup: true, psa: true, security: false };
  expect(filterByFeatureFlags(list, flags).map((p) => p.id)).toEqual(['backup', 'psa']);
  expect(filterByFeatureFlags(list, flags, true).map((p) => p.id)).toEqual([
    'backup',
    'psa',
    'security'
  ]);
});
