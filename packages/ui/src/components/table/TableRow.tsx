import React from 'react';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  rowId?: string | number;
}

export const TableRow: React.FC<TableRowProps> = ({ selected, className, rowId, ...props }) => {
  const classes = ['ui-table__row', selected ? 'ui-table__row--selected' : '', className]
    .filter(Boolean)
    .join(' ');
  return <tr data-rowid={rowId} className={classes} {...props} />;
};
