import { DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { DeleteDocument } from '../DeleteDocument/index.js';
import { Props } from './types.js';

export const DeleteButton: React.FC<Props> = ({ id, slug, disabled, onSuccess }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleOnSuccess = () => {
    onSuccess();
  };

  return (
    <>
      <DeleteDocument
        id={id}
        slug={slug}
        openState={open}
        onSuccess={handleOnSuccess}
        onClose={handleOnClose}
      />
      <Tooltip title={t('delete')} arrow placement="top">
        <span>
          <IconButton color="error" disabled={disabled} onClick={handleClickOpen}>
            <DeleteOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
