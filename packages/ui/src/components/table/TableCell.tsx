import React from 'react';

export interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  header?: boolean;
  width?: string | number;
  align?: 'start' | 'center' | 'end';
}

export const TableCell: React.FC<TableCellProps> = ({
  header = false,
  width,
  align,
  className,
  children,
  ...props
}) => {
  const Tag = header ? 'th' : 'td';
  const classes = ['ui-table__cell', header ? 'ui-table__cell--header' : '', className]
    .filter(Boolean)
    .join(' ');
  const style: React.CSSProperties = { width, textAlign: align };
  return (
    <Tag className={classes} style={style} {...props}>
      {children}
    </Tag>
  );
};
