import { Type } from '@admin/components/elements/Table/Cell/types';

export type Config = {
  serverUrl: string;
  collections: Collection[];
};

export type Collection = {
  id: number;
  collection: string;
  singleton: boolean;
  hidden: boolean;
  fields: Field[];
};

export type Field = {
  field: string;
  label: string;
  type: (typeof Type)[keyof typeof Type];
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  token: string | null;
  isActive: boolean;
  role?: Role;
};

export type Role = {
  id: number;
  name: string;
  description: string;
  adminAccess: boolean;
  permissions: Permission[];
};

export type PermissionsAction = 'create' | 'read' | 'update' | 'delete';

export type Permission = {
  id: number;
  collection: string;
  action: PermissionsAction;
};

export type ProjectSetting = {
  name: string;
};

// new model

export type SuperfastCollection = {
  id: number;
  collection: string;
  singleton: boolean;
  hidden: boolean;
  superfastFields: SuperfastField[];
};

export type SuperfastUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  token: string | null;
  isActive: boolean;
  superfastRole?: SuperfastRole;
};

export type SuperfastField = {
  field: string;
  label: string;
  type: (typeof Type)[keyof typeof Type];
};

export type SuperfastRole = {
  id: number;
  name: string;
  description: string;
  adminAccess: boolean;
  permissions: SuperfastPermission[];
};

export type SuperfastPermission = {
  id: number;
  collection: string;
  action: PermissionsAction;
};

export type SuperfastProjectSetting = {
  name: string;
};
