import { KeyedMutator } from 'swr';
import { Collection, Permission, PermissionsAction } from '../../../../config/types.js';

export type Props = {
  roleId: string;
  permissions: Permission[];
  mutate: KeyedMutator<Permission[]>;
  collection: Collection;
  action: PermissionsAction;
};
