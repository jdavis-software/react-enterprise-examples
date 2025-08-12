import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import './Input.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id ?? useId();
    const errorId = error ? `${inputId}-error` : undefined;
    return (
      <div className={['ui-input', className].filter(Boolean).join(' ')}>
        {label && (
          <label htmlFor={inputId} className="ui-input__label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'ui-input__field',
            error ? 'ui-input__field--error' : ''
          ]
            .filter(Boolean)
            .join(' ')}
          aria-describedby={errorId}
          {...props}
        />
        {error && (
          <p id={errorId} className="ui-input__error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
