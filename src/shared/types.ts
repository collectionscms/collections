import { Type } from '@admin/components/elements/Table/Cell/types';

export type Field = {
  field: string;
  label: string;
  type: typeof Type[keyof typeof Type];
};

export type User = {
  id: number;
  email: string;
  userName: string;
};
