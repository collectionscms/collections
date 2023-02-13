import { DeleteOutlineOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import { t } from 'i18next';
import React, { useState } from 'react';
import DeleteDocument from '../DeleteDocument';
import { Props } from './types';

const DeleteHeaderButton: React.FC<Props> = ({ id, slug, disabled, onSuccess }) => {
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

export default DeleteHeaderButton;
