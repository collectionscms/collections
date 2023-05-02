import { Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ComposeWrapper } from '../../../../components/utilities/ComposeWrapper/index.js';
import { RoleContextProvider, useRole } from '../../Context/index.js';
import { Props } from './types';

const EditRoleMenuImpl: React.FC<Props> = (props) => {
  const { roleId, permissionId, collection, action, menu, onSuccess, onClose } = props;
  const { t } = useTranslation();
  const { createPermission, deletePermission } = useRole();
  const { trigger: createPermissionTrigger } = createPermission(roleId);
  const { trigger: deletePermissionTrigger } = deletePermission(roleId, permissionId || '');
  const isAllowed = permissionId !== null;

  const handleClose = () => {
    onClose();
  };

  const handleCreate = () => {
    createPermissionTrigger({
      collection,
      action,
    });
    onSuccess();
  };

  const handleDelete = () => {
    deletePermissionTrigger();
    onSuccess();
  };

  return (
    <Menu
      anchorEl={menu}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={Boolean(menu)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleCreate} disabled={isAllowed}>
        {t('allow')}
      </MenuItem>
      <MenuItem onClick={handleDelete} disabled={!isAllowed}>
        {t('not_allow')}
      </MenuItem>
    </Menu>
  );
};

export const EditRoleMenu = ComposeWrapper({ context: RoleContextProvider })(EditRoleMenuImpl);
