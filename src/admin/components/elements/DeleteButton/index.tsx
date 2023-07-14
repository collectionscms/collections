import { DeleteOutlined } from '@ant-design/icons';
import { IconButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
        <IconButton color="error" disabled={disabled} onClick={handleClickOpen}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
    </>
  );
};
