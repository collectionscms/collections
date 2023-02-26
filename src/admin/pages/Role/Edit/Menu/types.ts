import { PermissionsAction } from '../../../../../shared/types';

export type Props = {
  roleId: string;
  permissionId?: string | null;
  collection: string;
  action: PermissionsAction;
  menu: any;
  onSuccess: () => void;
  onClose: () => void;
};
