import { Divider, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteDocument } from '../../../../components/elements/DeleteDocument/index.js';
import { Props } from './types.js';

export const EditMenu: React.FC<Props> = ({
  id,
  collectionId,
  menu,
  onEdit,
  onSuccess,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSuccess = () => {
    setOpen(false);
    onSuccess();
  };

  const onEditField = () => {
    onEdit();
    onClose();
  };

  const onDelete = () => {
    setOpen(true);
    onClose();
  };

  return (
    <>
      <DeleteDocument
        id={id}
        slug={`collections/${collectionId}/fields`}
        openState={open}
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
      <Menu
        anchorEl={menu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(menu)}
        onClose={handleClose}
      >
        <MenuItem onClick={onEditField}>{t('edit_field')}</MenuItem>
        <Divider />
        <MenuItem onClick={onDelete}>{t('delete_field')}</MenuItem>
      </Menu>
    </>
  );
};
