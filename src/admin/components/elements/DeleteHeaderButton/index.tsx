import { DeleteOutlineOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteDocument } from '../DeleteDocument/index.js';
import { Props } from './types.js';

export const DeleteHeaderButton: React.FC<Props> = ({ id, slug, disabled, onSuccess }) => {
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
      <Button
        variant="text"
        disabled={disabled}
        startIcon={<DeleteOutlineOutlined />}
        onClick={handleClickOpen}
      >
        {t('delete')}
      </Button>
    </>
  );
};
