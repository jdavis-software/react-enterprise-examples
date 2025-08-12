import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { Modal } from './Modal';
import { I18nProvider } from '../../i18n/I18nProvider';
import { useRef, useState } from 'react';

function Wrapper() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <I18nProvider>
      <button ref={triggerRef} onClick={() => setOpen(true)}>
        open
      </button>
      <Modal open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
    </I18nProvider>
  );
}

test('focus moves into modal and returns', async () => {
  render(<Wrapper />);
  const input = screen.getByLabelText(/your name/i);
  expect(input).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(screen.getByText('open')).toHaveFocus();
});
