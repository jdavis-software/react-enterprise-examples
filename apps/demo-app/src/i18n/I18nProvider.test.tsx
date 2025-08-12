import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { I18nProvider, useI18n } from './I18nProvider';
import { useIntl } from 'react-intl';

function Comp() {
  const { setLocale } = useI18n();
  const intl = useIntl();
  return (
    <div>
      <span>{intl.formatMessage({ id: 'hello' })}</span>
      <button onClick={() => setLocale('es')}>es</button>
    </div>
  );
}

test('switches locale to es', async () => {
  render(
    <I18nProvider>
      <Comp />
    </I18nProvider>
  );
  expect(screen.getByText('Hello')).toBeInTheDocument();
  await userEvent.click(screen.getByText('es'));
  expect(screen.getByText('Hola')).toBeInTheDocument();
});
