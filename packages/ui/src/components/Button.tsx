import { ReactNode, ButtonHTMLAttributes } from 'react';

type Variants = 'primary' | 'danger' | 'subtle';
type Sizes = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  sm: { padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: '0.8rem' },
  md: { padding: 'var(--spacing-md) var(--spacing-lg)', fontSize: '1rem' },
  lg: { padding: 'var(--spacing-lg) calc(var(--spacing-lg) * 1.5)', fontSize: '1.2rem' }
};

export function Button({ variant = 'primary', size = 'md', style, children, ...props }: ButtonProps) {
  return (
    <button
      style={{ border: 'none', borderRadius: 'var(--radius-md)', ...variantStyles[variant], ...sizeStyles[size], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
