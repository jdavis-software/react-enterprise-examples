import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { createContext } from 'react';

const ThemeContext = createContext('light');

interface Options {
  route?: string;
  locale?: string;
  theme?: string;
}

export function renderWithProviders(ui: ReactElement, { route = '/', locale = 'en', theme = 'light' }: Options = {}) {
  window.history.pushState({}, 'Test', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <IntlProvider locale={locale} messages={{}}>
        <ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>
      </IntlProvider>
    </MemoryRouter>
  );
}

export * from '@testing-library/react';
