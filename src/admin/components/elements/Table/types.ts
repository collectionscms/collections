import React from 'react';

export type Column = {
  field: string;
  label: string;
  renderCell: (index: number, row: any, data: any) => React.ReactNode;
};

export type Props = {
  columns: Column[];
  rows: unknown[];
};
