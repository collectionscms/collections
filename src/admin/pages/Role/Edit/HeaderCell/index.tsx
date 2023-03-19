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
  const showTooltip = () => {
    switch (action) {
      case 'create':
        return (
          <Tooltip title={t('create_new')} arrow>
            <AddOutlined />
          </Tooltip>
        );
      case 'read':
        return (
          <Tooltip title={t('read')} arrow>
            <VisibilityOutlined />
          </Tooltip>
        );
      case 'update':
        return (
          <Tooltip title={t('update')} arrow>
            <ModeEditOutlineOutlined />
          </Tooltip>
        );
      case 'delete':
        return (
          <Tooltip title={t('delete')} arrow>
            <DeleteOutlineOutlined />
          </Tooltip>
        );
      default:
        return <span />;
    }
  };

  return showTooltip();
};

export default PermissionHeaderCell;
