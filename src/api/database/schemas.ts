type PrimaryKey = {
  id: number;
};

export type Collection = {
  collection: string;
  singleton: boolean;
  hidden: boolean;
  status_field: string | null;
  draft_value: string | null;
  publish_value: string | null;
  archive_value: string | null;
} & PrimaryKey;

export type FieldSchema = {
  collection: string;
  field: string;
  label: string;
  special: string | null;
  interface: string | null;
  options: string | null;
  readonly: boolean;
  required: boolean;
  hidden: boolean;
  sort: number;
} & PrimaryKey;

export type User = {
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  reset_password_token?: string | null;
  reset_password_expiration?: number | null;
  api_key?: string | null;
  role_id?: number | null;
  updated_at?: Date;
} & PrimaryKey;

export type Role = {
  name: string;
  description: string | null;
  admin_access: boolean;
} & PrimaryKey;

export type Permission = {
  collection: string;
  action: string;
  role_id: number | null;
} & PrimaryKey;

export type ProjectSetting = {
  name: string;
  before_login?: string | null;
  after_login?: string | null;
} & PrimaryKey;

export type File = {
  storage: string;
  file_name: string;
  file_name_disk: string;
  type: string;
  file_size: number | null;
  width: number | null;
  height: number | null;
} & PrimaryKey;

export type Relation = {
  many_collection: string;
  many_field: string;
  one_collection: string;
  one_field: string;
} & PrimaryKey;

export const referencedTypes = ['listOneToMany'];
