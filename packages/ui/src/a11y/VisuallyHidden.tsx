import { HTMLAttributes } from 'react';

const style: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0
};

export function VisuallyHidden(props: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} style={{ ...style, ...props.style }} />;
}
