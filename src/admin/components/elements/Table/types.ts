import { Field } from '@shared/types';
import React from 'react';

export type Column = {
  field: Field;
  label: string;
  customRenderCell?: (index: number, row: any, data: any) => React.ReactNode;
};

export type Props = {
  columns: Column[];
  rows: {
    [path: string]: unknown;
  }[];
};
