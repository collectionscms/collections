export const Type = {
  Text: 'text',
  Number: 'number',
  Date: 'date',
  Object: 'object',
} as const;

export type Props = {
  colIndex: number;
  type: typeof Type[keyof typeof Type];
  rowData: {
    [path: string]: unknown;
  };
  cellData: unknown;
};
