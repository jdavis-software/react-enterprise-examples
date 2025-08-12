import '@react-enterprise-examples/ui/tokens.scss';
import { useEffect, useRef, useState } from 'react';
import { DataGrid } from '../../features/a11y-i18n/DataGrid';
import { Modal } from '../../features/a11y-i18n/Modal';
import { AriaLive } from '@react-enterprise-examples/ui';
import { useI18n } from '../../i18n/I18nProvider';
import { useIntl } from 'react-intl';

export function Page() {
  const { locale, setLocale } = useI18n();
  const intl = useIntl();
  const [rtl, setRtl] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [modalOpen, setModalOpen] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  }, [rtl]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const closeModal = () => {
    setModalOpen(false);
    setLiveMessage(intl.formatMessage({ id: 'close' }));
  };

  return (
    <>
      <div className="stack">
        <div className="stack">
          <div>
            <span>{intl.formatMessage({ id: 'locale' })}:</span>
            <button onClick={() => setLocale('en')}>en</button>
            <button onClick={() => setLocale('es')}>es</button>
          </div>
          <div>
            <button onClick={() => setRtl(r => !r)}>
              {intl.formatMessage({ id: 'rtl' })}: {rtl ? 'on' : 'off'}
            </button>
          </div>
          <div>
            <button onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
              {intl.formatMessage({ id: 'theme' })}: {theme}
            </button>
          </div>
        </div>

        <section>
          <h2>{intl.formatMessage({ id: 'titleGrid' })}</h2>
          <DataGrid />
        </section>

        <section>
          <h2>{intl.formatMessage({ id: 'titleModal' })}</h2>
          <button ref={triggerRef} onClick={() => setModalOpen(true)}>
            {intl.formatMessage({ id: 'openModal' })}
          </button>
          <Modal open={modalOpen} onClose={closeModal} triggerRef={triggerRef} />
        </section>

        <section>
          <h2>{intl.formatMessage({ id: 'titleText' })}</h2>
          <p>{intl.formatMessage({ id: 'longText' })}</p>
        </section>

        <AriaLive mode="polite">{liveMessage}</AriaLive>
      </div>
    </>
  );
}
