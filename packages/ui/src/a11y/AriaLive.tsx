import { ReactNode } from 'react';

interface Props {
  mode?: 'polite' | 'assertive';
  children?: ReactNode;
}

export function AriaLive({ mode = 'polite', children }: Props) {
  return (
    <div aria-live={mode} aria-atomic="true">
      {children}
    </div>
  );
}
