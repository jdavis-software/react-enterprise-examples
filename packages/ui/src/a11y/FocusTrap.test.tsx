import { render } from '@testing-library/react';
import { test, expect } from 'vitest';
import { FocusTrap } from './FocusTrap';
import { createRef } from 'react';

test('focuses initial and returns to trigger', () => {
  const initial = createRef<HTMLInputElement>();
  const trigger = createRef<HTMLButtonElement>();
  const { rerender } = render(
    <>
      <button ref={trigger}>trigger</button>
      <FocusTrap active={true} initialFocusRef={initial} returnFocusRef={trigger}>
        <div>
          <input ref={initial} />
          <button>ok</button>
        </div>
      </FocusTrap>
    </>
  );
  expect(initial.current).toHaveFocus();
  rerender(
    <>
      <button ref={trigger}>trigger</button>
      <FocusTrap active={false} returnFocusRef={trigger}>
        <div>
          <input ref={initial} />
        </div>
      </FocusTrap>
    </>
  );
  expect(trigger.current).toHaveFocus();
});
