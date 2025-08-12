import { HTMLAttributes, ReactNode } from 'react';
import './Card.scss';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ header, footer, children, className, ...props }: CardProps) {
  return (
    <div className={["ui-card", className].filter(Boolean).join(' ')} {...props}>
      {header && <div className="ui-card__header">{header}</div>}
      <div className="ui-card__body">{children}</div>
      {footer && <div className="ui-card__footer">{footer}</div>}
    </div>
  );
}
