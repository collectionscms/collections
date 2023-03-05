import { Type } from './Cell/types';
import React from 'react';

export type Column = {
  field: ColumnField;
  label: string;
  customRenderCell?: (index: number, row: any, data: any) => React.ReactNode;
};

export type ColumnField = {
  field: string;
  label: string;
  type: (typeof Type)[keyof typeof Type];
};

export type Props = {
  columns: Column[];
  rows?: {
    [path: string]: unknown;
  }[];
};
