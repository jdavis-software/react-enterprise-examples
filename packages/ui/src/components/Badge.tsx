import { ReactNode, HTMLAttributes } from 'react';

type Variants = 'primary' | 'danger' | 'subtle';
type Sizes = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variants;
  size?: Sizes;
  children: ReactNode;
}

const variantStyles: Record<Variants, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--color-primary)', color: '#fff' },
  danger: { backgroundColor: 'var(--color-danger)', color: '#fff' },
  subtle: { backgroundColor: 'var(--color-subtle)', color: '#fff' }
};

const sizeStyles: Record<Sizes, React.CSSProperties> = {
  sm: { padding: '0 var(--spacing-sm)', fontSize: '0.75rem' },
  md: { padding: '0 var(--spacing-md)', fontSize: '0.875rem' },
  lg: { padding: '0 var(--spacing-lg)', fontSize: '1rem' }
};

export function Badge({ variant = 'primary', size = 'md', style, children, ...props }: BadgeProps) {
  return (
    <span
      style={{ borderRadius: 'var(--radius-sm)', display: 'inline-block', ...variantStyles[variant], ...sizeStyles[size], ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
