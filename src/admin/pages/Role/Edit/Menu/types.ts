import { Model, PermissionsAction } from '../../../../config/types.js';

export type Props = {
  roleId: string;
  permissionId: string | null;
  model: Model;
  action: PermissionsAction;
  menu: any;
  onCreate: () => void;
  onDelete: () => void;
  onClose: () => void;
};
