import React from 'react';
import { CellType } from './Cell/types.js';

export type Column = {
  field: ColumnField;
  label: string;
  customRenderCell?: (index: number, row: any, data: any) => React.ReactNode;
};

export type ColumnField = {
  field: string;
  label: string;
  type: CellType;
  width?: number;
};

export type Props = {
  columns: Column[];
  rows: {
    [path: string]: unknown;
  }[];
};
