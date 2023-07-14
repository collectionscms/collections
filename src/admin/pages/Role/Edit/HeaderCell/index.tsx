import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { Props } from './types.js';

export const PermissionHeaderCell: React.FC<Props> = ({ action }) => {
  const showTooltip = () => {
    switch (action) {
      case 'create':
        return (
          <Tooltip title={t('create_new')} arrow placement="top">
            <PlusOutlined />
          </Tooltip>
        );
      case 'read':
        return (
          <Tooltip title={t('read')} arrow placement="top">
            <EyeOutlined />
          </Tooltip>
        );
      case 'update':
        return (
          <Tooltip title={t('update')} arrow placement="top">
            <EditOutlined />
          </Tooltip>
        );
      case 'delete':
        return (
          <Tooltip title={t('delete')} arrow placement="top">
            <DeleteOutlined />
          </Tooltip>
        );
      default:
        return <span />;
    }
  };

  return showTooltip();
};
