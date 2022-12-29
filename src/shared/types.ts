import { Type } from '@admin/components/elements/Table/Cell/types';

export type Config = {
  collections: Collection[];
};

export type Collection = {
  collection: string;
  singleton: boolean;
};

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
