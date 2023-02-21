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
  field_options: FieldOption[];
};

export type FieldOption = {
  key: string;
  value: string;
};

export type AuthUser = {
  id: number;
  user_name: string;
  admin_access: boolean;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_name: string;
  token: string | null;
  is_active: boolean;
  role?: Role;
};

export type Role = {
  id: number;
  name: string;
  description: string;
  admin_access: boolean;
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
