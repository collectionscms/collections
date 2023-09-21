import { Collection, PermissionsAction } from '../../../../config/types.js';

export type Props = {
  roleId: string;
  permissionId: string | null;
  collection: Collection;
  action: PermissionsAction;
  menu: any;
  onCreate: () => void;
  onDelete: () => void;
  onClose: () => void;
};
