import { HTMLAttributes } from 'react';
import './Badge.scss';

type Variants =
  | 'info'
  | 'success'
  | 'warning'
  | 'neutral'
  | 'primary'
  | 'danger'
  | 'subtle';
type Tones = 'solid' | 'soft';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variants;
  tone?: Tones;
}

export function Badge({ variant = 'neutral', tone = 'solid', className, ...props }: BadgeProps) {
  const finalVariant = variant === 'subtle' ? 'neutral' : variant;
  const finalTone = variant === 'subtle' ? 'soft' : tone;
  const classes = ['ui-badge', `ui-badge--${finalVariant}`, `ui-badge--${finalTone}`, className]
    .filter(Boolean)
    .join(' ');
  return <span className={classes} {...props} />;
}
