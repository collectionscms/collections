import {
  AddOutlined,
  DeleteOutlineOutlined,
  ModeEditOutlineOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { Props } from './types';

const PermissionHeaderCell: React.FC<Props> = ({ action }) => {
  return (
    <>
      {action === 'create' ? (
        <Tooltip title={t('create_new')} arrow>
          <AddOutlined />
        </Tooltip>
      ) : action === 'read' ? (
        <Tooltip title={t('read')} arrow>
          <VisibilityOutlined />
        </Tooltip>
      ) : action === 'update' ? (
        <Tooltip title={t('update')} arrow>
          <ModeEditOutlineOutlined />
        </Tooltip>
      ) : (
        <Tooltip title={t('delete')} arrow>
          <DeleteOutlineOutlined />
        </Tooltip>
      )}
    </>
  );
};

export default PermissionHeaderCell;
