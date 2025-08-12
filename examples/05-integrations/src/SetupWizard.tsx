import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, FocusTrap } from '@react-enterprise-examples/ui';
import type { IntegrationProvider } from '../../../packages/adapters/src/providers';
import './SetupWizard.scss';

interface Props {
  provider: IntegrationProvider;
  onClose(): void;
  onConnected(): void;
}

export function SetupWizard({ provider, onClose, onConnected }: Props) {
  const [step, setStep] = useState(1);
  const [terms, setTerms] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function connect() {
    setLoading(true);
    await provider.connect({ apiKey });
    setLoading(false);
    onConnected();
  }

  return (
    <div className="wizard-overlay" role="dialog" aria-labelledby="wizard-title">
      <FocusTrap active initialFocusRef={dialogRef} returnFocusRef={dialogRef}>
        <div className="wizard" ref={dialogRef}>
          {step === 1 && (
            <div>
              <h2 id="wizard-title">Connect {provider.displayName}</h2>
              <label>
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                I agree to the terms
              </label>
              <Button onClick={() => setStep(2)} disabled={!terms}>
                Next
              </Button>
            </div>
          )}
          {step === 2 && (
            <div>
              <label>
                API Key
                <Input value={apiKey} onChange={(e) => setApiKey(e.currentTarget.value)} />
              </label>
              <Button onClick={() => setStep(3)} disabled={!apiKey}>
                Next
              </Button>
            </div>
          )}
          {step === 3 && (
            <div>
              <p>Ready to connect?</p>
              <Button onClick={connect} disabled={loading}>
                {loading ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          )}
          <Button size="sm" onClick={onClose} style={{ alignSelf: 'flex-end' }}>
            Close
          </Button>
        </div>
      </FocusTrap>
    </div>
  );
}
