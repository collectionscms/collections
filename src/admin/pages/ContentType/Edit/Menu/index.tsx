import { Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteDocument from '../../../../components/elements/DeleteDocument';
import { Props } from './types';

const EditMenu: React.FC<Props> = ({ id, collectionId, menu, onSuccess, onClose }) => {
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

  const handleDelete = () => {
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
        <MenuItem onClick={handleDelete}>{t('delete')}</MenuItem>
      </Menu>
    </>
  );
};

export default EditMenu;
