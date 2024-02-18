import { Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteDocument } from '../../../components/elements/DeleteDocument/index.js';

type Props = {
  id: string;
  menu: any;
  onSuccess: () => void;
  onClose: () => void;
};

export const EditMenu: React.FC<Props> = (props) => {
  const { id, menu, onSuccess, onClose } = props;
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

  const onDelete = () => {
    setOpen(true);
    onClose();
  };

  return (
    <>
      <DeleteDocument
        id={id}
        slug={'posts'}
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
        <MenuItem onClick={onDelete}>{t('delete')}</MenuItem>
      </Menu>
    </>
  );
};
