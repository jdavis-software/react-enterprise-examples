import type { Meta, StoryObj } from '@storybook/react';
import { FocusTrap } from '../src/a11y/FocusTrap';
import { useRef, useState } from 'react';

const meta: Meta = { title: 'A11y/FocusTrap' };
export default meta;

export const Basic: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    return (
      <div>
        <button ref={trigger} onClick={() => setOpen(true)}>
          Open
        </button>
        {open && (
          <FocusTrap active initialFocusRef={trigger} returnFocusRef={trigger}>
            <div style={{ border: '1px solid', padding: '1rem' }}>
              <p>Trapped</p>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>
          </FocusTrap>
        )}
      </div>
    );
  }
};
