import { Permission, PermissionsAction } from '../../../../../shared/types';

export type Props = {
  roleId: string;
  permissions: Permission[];
  collection: string;
  action: PermissionsAction;
  onSuccess: (permissionId: number) => void;
};
