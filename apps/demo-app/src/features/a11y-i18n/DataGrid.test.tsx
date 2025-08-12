import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { DataGrid } from './DataGrid';
import { I18nProvider } from '../../i18n/I18nProvider';

test('arrow keys move focus', async () => {
  render(
    <I18nProvider>
      <DataGrid />
    </I18nProvider>
  );
  const cells = screen.getAllByRole('gridcell');
  cells[0].focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(cells[1]).toHaveFocus();
});

test('aria-sort toggles', async () => {
  render(
    <I18nProvider>
      <DataGrid />
    </I18nProvider>
  );
  const header = screen.getByRole('columnheader', { name: /name/i });
  expect(header).toHaveAttribute('aria-sort', 'none');
  await userEvent.click(header);
  expect(header).toHaveAttribute('aria-sort', 'ascending');
  expect(screen.getByText(/sorted/i)).toBeInTheDocument();
});
