import { Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ComposeWrapper } from '../../../../components/utilities/ComposeWrapper/index.js';
import { RoleContextProvider } from '../../Context/index.js';
import { Props } from './types.js';

const EditRoleMenuImpl: React.FC<Props> = (props) => {
  const { permissionId, menu, onCreate, onDelete, onClose } = props;
  const { t } = useTranslation();
  const isAllowed = permissionId !== null;

  const handleClose = () => {
    onClose();
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
      <MenuItem onClick={onCreate} disabled={isAllowed}>
        {t('allow')}
      </MenuItem>
      <MenuItem onClick={onDelete} disabled={!isAllowed}>
        {t('not_allow')}
      </MenuItem>
    </Menu>
  );
};

export const EditRoleMenu = ComposeWrapper({ context: RoleContextProvider })(EditRoleMenuImpl);
