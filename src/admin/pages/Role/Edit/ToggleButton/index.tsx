import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { IconButton } from 'superfast-ui';
import { PermissionsAction } from '../../../../config/types.js';
import { EditRoleMenu } from '../Menu/index.js';
import { Props } from './types.js';

export const PermissionToggleButton: React.FC<Props> = (props) => {
  const { roleId, permissions, collection, action, onSuccess } = props;
  const [menu, setMenu] = useState<EventTarget | null>(null);
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<PermissionsAction | null>(null);

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
    onSuccess(selectedPermissionId!);
  };

  const permission = permissions.filter(
    (permission) => permission.collection === collection && permission.action === action
  )[0];

  return (
    <>
      <EditRoleMenu
        roleId={roleId}
        permissionId={selectedPermissionId?.toString() || null}
        collection={selectedCollection!}
        action={selectedAction!}
        menu={menu}
        onSuccess={() => handleSuccess()}
        onClose={() => closeMenu()}
      />
      {permission ? (
        <IconButton
          aria-label="delete"
          color="success"
          onClick={(e) => openMenu(e.currentTarget, permission.id, collection, action)}
        >
          <CheckOutlined />
        </IconButton>
      ) : (
        <IconButton
          aria-label="create"
          color="error"
          onClick={(e) => openMenu(e.currentTarget, null, collection, action)}
        >
          <CloseOutlined />
        </IconButton>
      )}
    </>
  );
};
