import {
  Collection as CollectionSchema,
  Field as FieldSchema,
  File as FileSchema,
  Permission as PermissionSchema,
  ProjectSetting as ProjectSettingSchema,
  Relation as RelationSchema,
  Role as RoleSchema,
  User as UserSchema,
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

export type AuthUser = {
  id: number;
  roleId: number;
  userName: string;
  adminAccess: boolean;
  appAccess: boolean | null; // access from applications.
};

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
  | 'inputRichTextMd'
  | 'selectDropdown'
  | 'dateTime'
  | 'boolean'
  | 'fileImage'
  | 'listOneToMany'
  | 'selectDropdownManyToOne'
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
