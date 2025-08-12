import { ReactNode, RefObject, useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Props {
  active: boolean;
  initialFocusRef?: RefObject<HTMLElement>;
  returnFocusRef?: RefObject<HTMLElement>;
  children: ReactNode;
}

export function FocusTrap({ active, initialFocusRef, returnFocusRef, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      returnFocusRef?.current?.focus();
      return;
    }
    const node = ref.current!;
    const focusables = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    node.addEventListener('keydown', handleKey);
    const toFocus = initialFocusRef?.current || first;
    toFocus?.focus();
    return () => {
      node.removeEventListener('keydown', handleKey);
      returnFocusRef?.current?.focus();
    };
  }, [active]);

  return <div ref={ref}>{children}</div>;
}
