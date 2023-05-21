import {
  Collection as CollectionSchema,
  ProjectSetting as ProjectSettingSchema,
  Permission as PermissionSchema,
} from '../server/database/schemas.js';

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

export type MeUser = {
  id: number;
  roleId: number;
  userName: string;
  password: string;
  adminAccess: boolean;
  appAccess: boolean | null; // access from applications.
  apiKey: string | null;
};

export type AuthUser = Omit<MeUser, 'password'>;

// /////////////////////////////////////
// Error
// /////////////////////////////////////

export type ApiError = {
  status: number;
  code: string;
  extensions?: {
    message?: string;
  };
};

// /////////////////////////////////////
// Schema
// /////////////////////////////////////

type PrimaryKey = {
  id: number;
};

export type Collection = {} & CollectionSchema;

export type FieldInterface =
  | 'input'
  | 'inputMultiline'
  // | 'inputRichTextHtml'
  | 'inputRichTextMd'
  | 'selectDropdown'
  | 'dateTime'
  | 'boolean'
  // | 'file'
  | 'fileImage'
  // | 'list'
  // | 'listO2o' // one-to-one
  // | 'listO2m' // one-to-many
  // | 'selectDropdownM2o' // many-to-one
  | 'selectDropdownStatus'; // public status
export type FieldOption = {
  choices?: Choice[];
  defaultValue?: any;
};
export type Choice = {
  label: string;
  value: string;
};
export type Field = {
  collection: string;
  field: string;
  label: string;
  special: string | null;
  interface: FieldInterface;
  options: string | null;
  required: boolean;
  readonly: boolean;
  hidden: boolean;
  sort: number;
  fieldOption?: FieldOption | null;
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
  action: PermissionsAction;
} & PermissionSchema;

export type ProjectSetting = {} & ProjectSettingSchema;

export type File = {
  storage: string;
  fileName: string;
  fileNameDisk: string;
  type: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
} & PrimaryKey;
