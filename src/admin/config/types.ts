import { AuthUser as AuthUserEntity } from '../../api/config/types.js';
import {
  Model as ModelSchema,
  Field as FieldSchema,
  File as FileSchema,
  Permission as PermissionSchema,
  ProjectSetting as ProjectSettingSchema,
  Relation as RelationSchema,
  Role as RoleSchema,
  User as UserSchema,
} from '../../api/database/schemas.js';

// /////////////////////////////////////
// Configure
// /////////////////////////////////////

export type Config = {
  serverUrl: string;
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
// DTO: Authentication
// /////////////////////////////////////

export type AuthUser = {} & AuthUserEntity;

// /////////////////////////////////////
// DTO: Field
// /////////////////////////////////////

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
  default_value?: any;
};

export type Choice = {
  label: string;
  value: string;
};

// TODO Subdivided
export type Field = {
  interface: FieldInterface;
  field_option?: FieldOption | null;
} & FieldSchema;

export type GetField = {
  interface: FieldInterface;
  field_option?: FieldOption | null;
} & FieldSchema;

// /////////////////////////////////////
// DTO: Model
// /////////////////////////////////////

// TODO Subdivided
export type Model = {} & ModelSchema;

export type PostModel = {
  status?: boolean;
} & ModelSchema;

export type GetModel = {} & ModelSchema;

export type GetModels = { models: GetModel[] };

// /////////////////////////////////////
// DTO: User
// /////////////////////////////////////

export type User = {
  role?: Role;
} & UserSchema;

// /////////////////////////////////////
// DTO: Role
// /////////////////////////////////////

export type Role = {
  permissions: Permission[];
} & RoleSchema;

// /////////////////////////////////////
// DTO: Permission
// /////////////////////////////////////

export type PermissionsAction = 'create' | 'read' | 'update' | 'delete';
export type Permission = {
  action: PermissionsAction;
} & PermissionSchema;

// /////////////////////////////////////
// DTO: Project Setting
// /////////////////////////////////////

export type ProjectSetting = {} & ProjectSettingSchema;

// /////////////////////////////////////
// DTO: File
// /////////////////////////////////////

export type File = { url?: string } & FileSchema;

// /////////////////////////////////////
// DTO: Relation
// /////////////////////////////////////

export type GetRelation = {} & RelationSchema;

// /////////////////////////////////////
// DTO: Me
// /////////////////////////////////////

export type Me = {
  user: AuthUser;
  email: string;
  api_key: string | null;
  token: string;
};
