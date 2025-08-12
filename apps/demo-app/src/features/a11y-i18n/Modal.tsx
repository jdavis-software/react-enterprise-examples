import { useRef } from 'react';
import { FocusTrap } from '@react-enterprise-examples/ui';
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
          <label>
            {intl.formatMessage({ id: 'formLabel' })}
            <input ref={inputRef} type="text" />
          </label>
          <div className="actions">
            <button onClick={onClose}>{intl.formatMessage({ id: 'submit' })}</button>
            <button onClick={onClose}>{intl.formatMessage({ id: 'close' })}</button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}
