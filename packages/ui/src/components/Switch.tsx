import { ButtonHTMLAttributes, KeyboardEvent, useId, useState } from 'react';
import './Switch.scss';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({ checked, defaultChecked, onChange, id, className, ...props }: SwitchProps) {
  const internalId = id ?? useId();
  const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const value = isControlled ? checked : uncontrolled;

  const toggle = () => {
    if (!isControlled) setUncontrolled(!value);
    onChange?.(!value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const classes = ['ui-switch', value ? 'ui-switch--checked' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      id={internalId}
      role="switch"
      aria-checked={value}
      className={classes}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      type="button"
      {...props}
    >
      <span className="ui-switch__thumb" />
    </button>
  );
}
