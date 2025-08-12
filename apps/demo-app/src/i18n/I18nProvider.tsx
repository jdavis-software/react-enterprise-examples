import { createContext, useContext, useState, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import en from './messages/en.json';
import es from './messages/es.json';

type Locale = 'en' | 'es';

const MESSAGES: Record<Locale, Record<string, string>> = { en, es };

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({ locale: 'en', setLocale: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={MESSAGES[locale]}>{children}</IntlProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
