export type Config = {
  serverUrl: string;
};

export type Collection = {
  id: number;
  collection: string;
  singleton: boolean;
  hidden: boolean;
};

export type FieldInterface = 'input' | 'inputMultiline' | 'inputRichTextHtml' | 'inputRichTextMd';

export type Field = {
  id: number;
  collection: string;
  field: string;
  label: string;
  interface: FieldInterface;
  required: boolean;
  readonly: boolean;
  hidden: boolean;
  fieldOptions: FieldOption[];
};

export type FieldOption = {
  key: string;
  value: string;
};

export type Token = {
  token: string;
};

export type AuthUser = {
  id: number;
  userName: string;
  adminAccess: boolean;
  apiKey: string | null;
};

export type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
  apiKey: string | null;
  isActive: boolean;
  role?: Role;
  updatedAt: Date;
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
