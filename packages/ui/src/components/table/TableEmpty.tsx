import React from 'react';

export function TableEmpty({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr className="ui-table__empty">
      <td colSpan={colSpan} className="ui-table__cell">
        {message}
      </td>
    </tr>
  );
}
