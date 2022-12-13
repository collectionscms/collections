import React from 'react';

export type Column = {
  accessor: string;
  label: string;
  renderCell: (row: any, data: any) => React.ReactNode;
};

export type Props = {
  columns: Column[];
  rows: unknown[];
};
