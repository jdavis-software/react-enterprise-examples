import { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import './Button.scss';

type Variants = 'primary' | 'danger' | 'subtle' | 'ghost';
type Sizes = 'sm' | 'md' | 'lg';

type ButtonPropsBase<T extends ElementType> = {
  as?: T;
  variant?: Variants;
  size?: Sizes;
  isLoading?: boolean;
  children: ReactNode;
};

export type ButtonProps<T extends ElementType = 'button'> = ButtonPropsBase<T> &
  Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';
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
    <Component
      className={classes}
      disabled={disabled || undefined}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
