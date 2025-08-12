import { HTMLAttributes } from 'react';
import './Badge.scss';

type Variants = 'info' | 'success' | 'warning' | 'neutral';
type Tones = 'solid' | 'soft';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variants;
  tone?: Tones;
}

export function Badge({ variant = 'neutral', tone = 'solid', className, ...props }: BadgeProps) {
  const classes = ['ui-badge', `ui-badge--${variant}`, `ui-badge--${tone}`, className]
    .filter(Boolean)
    .join(' ');
  return <span className={classes} {...props} />;
}
