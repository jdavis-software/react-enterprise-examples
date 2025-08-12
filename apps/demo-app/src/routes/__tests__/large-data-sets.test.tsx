import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@react-enterprise-examples/testing/test-utils';
import { withFakeTimers } from '@react-enterprise-examples/testing/vitest.setup';
import { Page } from '../../../../../examples/01-large-data-sets/Page';
import { makeDevices } from '../../../../../examples/01-large-data-sets/src/generateData';

describe.skip('Large Data Sets Page', () => {
  it('filters search with debounce and syncs URL', async () => {
    await withFakeTimers(async () => {
      const data = makeDevices(20);
      renderWithProviders(<Page initialDevices={data} />, { route: '/large-data-sets' });
      const input = screen.getByPlaceholderText('Search devices');
      await userEvent.type(input, 'Device 1');
      vi.runAllTimers();
      await screen.findByText(/Showing 1 of 20/);
      expect(window.location.search).toContain('q=Device%201');
    });
  }, 10000);

  it('toggles sort direction', async () => {
    const data = makeDevices(5);
    renderWithProviders(<Page initialDevices={data} />, { route: '/large-data-sets' });
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    await userEvent.click(nameHeader);
    expect(nameHeader.textContent).toMatch(/▼|▲/);
  }, 10000);
});
