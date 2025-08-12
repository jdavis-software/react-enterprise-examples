import { useRef } from 'react';
import { FocusTrap, Button, Input } from '@react-enterprise-examples/ui';
import { useIntl } from 'react-intl';
import './Modal.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export function Modal({ open, onClose, triggerRef }: ModalProps) {
  const intl = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <FocusTrap active={open} initialFocusRef={inputRef} returnFocusRef={triggerRef}>
      <div className="modal-overlay" onKeyDown={handleKey}>
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
        >
          <h2 id="modal-title">{intl.formatMessage({ id: 'titleModal' })}</h2>
          <p id="modal-desc">{intl.formatMessage({ id: 'modalGreeting', defaultMessage: 'This is a modal' })}</p>
          <Input
            ref={inputRef}
            type="text"
            label={intl.formatMessage({ id: 'formLabel' })}
          />
          <div className="actions">
            <Button onClick={onClose}>{intl.formatMessage({ id: 'submit' })}</Button>
            <Button onClick={onClose} variant="subtle">
              {intl.formatMessage({ id: 'close' })}
            </Button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
