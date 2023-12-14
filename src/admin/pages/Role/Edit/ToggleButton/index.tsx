import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { IconButton } from '@collectionscms/plugin-ui';
import { Model, PermissionsAction } from '../../../../config/types.js';
import { useRole } from '../../Context/index.js';
import { EditRoleMenu } from '../Menu/index.js';
import { Props } from './types.js';

export const PermissionToggleButton: React.FC<Props> = (props) => {
  const { roleId, permissions, mutate, model, action } = props;
  const [menu, setMenu] = useState<EventTarget | null>(null);
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | string | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedAction, setSelectedAction] = useState<PermissionsAction | null>(null);

  const { createPermission, deletePermission } = useRole();
  const { trigger: createPermissionTrigger } = createPermission(roleId);
  const { trigger: deletePermissionTrigger } = deletePermission(
    roleId,
    selectedPermissionId?.toString() || ''
  );

  const openMenu = (
    currentTarget: EventTarget,
    id: number | string | null,
    model: Model,
    action: PermissionsAction
  ) => {
    setSelectedPermissionId(id);
    setSelectedModel(model);
    setSelectedAction(action);
    setMenu(currentTarget);
  };
  const closeMenu = () => setMenu(null);

  const handleCreate = async () => {
    closeMenu();

    const permissionId = await createPermissionTrigger({
      model: selectedModel!.model,
      modelId: model.id,
      action,
    });

    mutate([
      ...permissions,
      {
        id: permissionId,
        model: model.model,
        modelId: model.id,
        roleId: Number(roleId),
        action,
      },
    ]);
  };

  const handleDelete = async () => {
    closeMenu();

    await deletePermissionTrigger();

    mutate(permissions.filter((permission) => permission.id !== selectedPermissionId));
  };

  const permission = permissions.filter(
    (permission) => permission.modelId === model.id && permission.action === action
  )[0];

  return (
    <>
      <EditRoleMenu
        roleId={roleId}
        permissionId={selectedPermissionId?.toString() || null}
        model={selectedModel!}
        action={selectedAction!}
        menu={menu}
        onCreate={() => handleCreate()}
        onDelete={() => handleDelete()}
        onClose={() => closeMenu()}
      />
      {permission ? (
        <IconButton
          aria-label="delete"
          color="success"
          onClick={(e) => openMenu(e.currentTarget, permission.id, model, action)}
        >
          <CheckOutlined />
        </IconButton>
      ) : (
        <IconButton
          aria-label="create"
          color="error"
          onClick={(e) => openMenu(e.currentTarget, null, model, action)}
        >
          <CloseOutlined />
        </IconButton>
      )}
    </>
  );
};
