import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.scss';

type Variants = 'primary' | 'danger' | 'subtle' | 'ghost';
type Sizes = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variants;
  size?: Sizes;
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const classes = [
      'ui-button',
      `ui-button--${variant}`,
      `ui-button--${size}`,
      isLoading ? 'ui-button--loading' : '',
      className
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || undefined}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
