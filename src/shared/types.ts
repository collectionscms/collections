// /////////////////////////////////////
// Configure
// /////////////////////////////////////

export type Config = {
  serverUrl: string;
};

// /////////////////////////////////////
// Authentication
// /////////////////////////////////////

export type Token = {
  token: string;
};

export type AuthUser = {
  id: number;
  roleId: number;
  userName: string;
  adminAccess: boolean;
  apiKey: string | null;
};

export type MeUser = {
  id: number;
  roleId: number;
  userName: string;
  password: string;
  adminAccess: boolean;
  apiKey: string | null;
};

// /////////////////////////////////////
// Schema
// /////////////////////////////////////

type PrimaryKey = {
  id: number;
};

export type Collection = {
  collection: string;
  singleton: boolean;
  hidden: boolean;
} & PrimaryKey;

export type FieldInterface = 'input' | 'inputMultiline' | 'inputRichTextHtml' | 'inputRichTextMd';
export type FieldOption = {
  key: string;
  value: string;
};
export type Field = {
  collection: string;
  field: string;
  label: string;
  interface: FieldInterface;
  required: boolean;
  readonly: boolean;
  hidden: boolean;
  fieldOptions?: FieldOption[];
} & PrimaryKey;

export type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
  apiKey: string | null;
  isActive: boolean;
  resetPasswordToken: string | null;
  resetPasswordExpiration: number | null;
  roleId: number;
  role?: Role;
  updatedAt: Date;
} & PrimaryKey;

export type Role = {
  name: string;
  description: string;
  adminAccess: boolean;
  permissions: Permission[];
} & PrimaryKey;

export type PermissionsAction = 'create' | 'read' | 'update' | 'delete';
export type Permission = {
  collection: string;
  action: PermissionsAction;
  roleId: number;
} & PrimaryKey;

export type ProjectSetting = {
  name: string;
} & PrimaryKey;
