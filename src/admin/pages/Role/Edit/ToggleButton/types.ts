import { KeyedMutator } from 'swr';
import { Model, Permission, PermissionsAction } from '../../../../config/types.js';

export type Props = {
  roleId: string;
  permissions: Permission[];
  mutate: KeyedMutator<Permission[]>;
  model: Model;
  action: PermissionsAction;
};
