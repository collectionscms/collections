import { Permission, PermissionsAction } from '../../../../config/types.js';

export type Props = {
  roleId: string;
  permissions: Permission[];
  collection: string;
  action: PermissionsAction;
  onSuccess: (permissionId: number) => void;
};
