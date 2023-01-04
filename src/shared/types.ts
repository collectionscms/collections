import { Type } from '@admin/components/elements/Table/Cell/types';

export type Config = {
  serverUrl: string;
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
  token: string | null;
  role: Role;
};

export type Role = {
  id: number;
  name: string;
  adminAccess: boolean;
  permissions: Permission[];
};

export type PermissionsAction = 'create' | 'read' | 'update' | 'delete';

export type Permission = {
  id: number;
  collection: string;
  action: PermissionsAction;
};
