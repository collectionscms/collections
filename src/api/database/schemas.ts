export type PrimaryKey = number; // | string;

export type TypeWithId = {
  id: PrimaryKey;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Model = {
  model: string;
  singleton: boolean;
  hidden: boolean;
  statusField: string | null;
  draftValue: string | null;
  publishValue: string | null;
  archiveValue: string | null;
  source?: string | null;
} & TypeWithId;

export type Field = {
  model: string;
  modelId: PrimaryKey;
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
  isActive: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: number | null;
  apiKey?: string | null;
  roleId?: number | null;
} & TypeWithId;

export type Role = {
  name: string;
  description: string | null;
  adminAccess: boolean;
} & TypeWithId;

export type Permission = {
  model: string;
  modelId: PrimaryKey;
  action: string;
  roleId: number | null;
} & TypeWithId;

export type ProjectSetting = {
  name: string;
  beforeLogin?: string | null;
  afterLogin?: string | null;
} & TypeWithId;

export type File = {
  storage: string;
  fileName: string;
  fileNameDisk: string;
  type: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
} & TypeWithId;

export type Relation = {
  manyModel: string;
  manyModelId: PrimaryKey;
  manyField: string;
  oneModel: string;
  oneModelId: PrimaryKey;
  oneField: string;
} & TypeWithId;

export const referencedTypes = ['listOneToMany'];
