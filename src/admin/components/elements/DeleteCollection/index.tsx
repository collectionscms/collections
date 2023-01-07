import { DeleteOutlineOutlined } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Props } from './types';

const DeleteCollection: React.FC<Props> = ({ id, collection, disabled }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    enqueueSnackbar(t('toast.deleted_successfully'), { variant: 'success' });
    navigate(`/admin/collections/${collection}`);
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('dialog.confirm_deletion_title')}</DialogTitle>
        <DialogContent id="alert-dialog-description">
          <DialogContentText>{t('dialog.confirm_deletion')}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleDelete} autoFocus>
            {t('ok')}
          </Button>
        </DialogActions>
      </Dialog>
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

export default DeleteCollection;
