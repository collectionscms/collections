import { Column } from '../types.js';

type Row = {
  id: number;
  [path: string]: unknown;
};

export type Props = {
  columns: Column[];
  rows: Row[];
  onChange: (row: Row) => void;
};
