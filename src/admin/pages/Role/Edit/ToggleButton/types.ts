import { Collection, Permission, PermissionsAction } from '../../../../config/types.js';

export type Props = {
  roleId: string;
  permissions: Permission[];
  collection: Collection;
  action: PermissionsAction;
  onSuccess: (permissionId: number) => void;
};
