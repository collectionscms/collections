export type PrimaryKey = number; // | string;

export type TypeWithId = {
  id: PrimaryKey;
  created_at?: Date;
  updated_at?: Date;
};

export type Model = {
  model: string;
  singleton: boolean;
  hidden: boolean;
  status_field: string | null;
  draft_value: string | null;
  publish_value: string | null;
  archive_value: string | null;
  source?: string | null;
} & TypeWithId;

export type Field = {
  model: string;
  model_id: PrimaryKey;
  field: string;
  label: string;
  special: string | null;
  interface: string | null;
  options: string | null;
  readonly: boolean;
  required: boolean;
  hidden: boolean;
  sort: number | null;
} & TypeWithId;

export type User = {
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  reset_password_token?: string | null;
  reset_password_expiration?: number | null;
  api_key?: string | null;
  role_id?: number | null;
} & TypeWithId;

export type Role = {
  name: string;
  description: string | null;
  admin_access: boolean;
} & TypeWithId;

export type Permission = {
  model: string;
  model_id: PrimaryKey;
  action: string;
  role_id: number | null;
} & TypeWithId;

export type ProjectSetting = {
  name: string;
  before_login?: string | null;
  after_login?: string | null;
} & TypeWithId;

export type File = {
  storage: string;
  file_name: string;
  file_name_disk: string;
  type: string;
  file_size: number | null;
  width: number | null;
  height: number | null;
} & TypeWithId;

export type Relation = {
  many_model: string;
  many_model_id: PrimaryKey;
  many_field: string;
  one_model: string;
  one_model_id: PrimaryKey;
  one_field: string;
} & TypeWithId;

export const referencedTypes = ['listOneToMany'];
