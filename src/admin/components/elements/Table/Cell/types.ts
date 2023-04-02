export const Type = {
  Text: 'text',
  Number: 'number',
  Date: 'date',
  Object: 'object',
  Status: 'status',
} as const;

export type Props = {
  colIndex: number;
  type: (typeof Type)[keyof typeof Type];
  rowData: {
    [path: string]: unknown;
  };
  cellData: unknown;
};
