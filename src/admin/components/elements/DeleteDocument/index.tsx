import { useConfig } from '@admin/components/utilities/Config';
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
import { Props } from './types';

const DeleteDocument: React.FC<Props> = ({ id, slug, disabled = false, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { serverUrl } = useConfig();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    const endpoint = `${serverUrl}/${slug}/${id}`;
    console.log(`api endpoint: ${endpoint}`);

    enqueueSnackbar(t('toast.deleted_successfully'), { variant: 'success' });
    setOpen(false);
    onSuccess();
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

export default DeleteDocument;
