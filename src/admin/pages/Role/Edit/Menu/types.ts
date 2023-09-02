import { PermissionsAction } from '../../../../config/types.js';

export type Props = {
  roleId: string;
  permissionId: string | null;
  collection: string;
  action: PermissionsAction;
  menu: any;
  onSuccess: () => void;
  onClose: () => void;
};
