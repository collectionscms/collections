import {
  Collection as CollectionSchema,
  ProjectSetting as ProjectSettingSchema,
  Role as RoleSchema,
  File as FileSchema,
  Field as FieldSchema,
  User as UserSchema,
  Permission as PermissionSchema,
  Relation as RelationSchema,
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
  interface: FieldInterface;
  fieldOption?: FieldOption | null;
} & FieldSchema;

export type User = {
  role?: Role;
} & UserSchema;

export type Role = {
  permissions: Permission[];
} & RoleSchema;

export type PermissionsAction = 'create' | 'read' | 'update' | 'delete';
export type Permission = {
  action: PermissionsAction;
} & PermissionSchema;

export type ProjectSetting = {} & ProjectSettingSchema;

export type File = {} & FileSchema;

export type Relation = {} & RelationSchema;
