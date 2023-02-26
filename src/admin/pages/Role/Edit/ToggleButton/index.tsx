import { CheckOutlined, ClearOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import { PermissionsAction } from '../../../../../shared/types';
import EditMenu from '../Menu';
import { Props } from './types';

const PermissionToggleButton: React.FC<Props> = (props) => {
  const { roleId, permissions, collection, action, onSuccess } = props;
  const [menu, setMenu] = useState(null);
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const openMenu = (
    currentTarget: EventTarget,
    id: number | null,
    collection: string,
    action: PermissionsAction
  ) => {
    setSelectedPermissionId(id);
    setSelectedCollection(collection);
    setSelectedAction(action);
    setMenu(currentTarget);
  };
  const closeMenu = () => setMenu(null);

  const handleSuccess = () => {
    closeMenu();
    onSuccess(selectedPermissionId);
  };

  const permission = permissions.filter(
    (permission) => permission.collection === collection && permission.action === action
  )[0];

  return (
    <>
      <EditMenu
        roleId={roleId}
        permissionId={selectedPermissionId}
        collection={selectedCollection}
        action={selectedAction}
        menu={menu}
        onSuccess={() => handleSuccess()}
        onClose={() => closeMenu()}
      />
      {permission ? (
        <IconButton
          aria-label="delete"
          onClick={(e) => openMenu(e.currentTarget, permission.id, collection, action)}
        >
          <CheckOutlined />
        </IconButton>
      ) : (
        <IconButton
          aria-label="create"
          onClick={(e) => openMenu(e.currentTarget, null, collection, action)}
        >
          <ClearOutlined />
        </IconButton>
      )}
    </>
  );
};

export default PermissionToggleButton;
