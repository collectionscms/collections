import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { DocumentContextProvider, useDocument } from '@admin/stores/Document';
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
import React, { useEffect, useState } from 'react';
import { Props } from './types';

const DeleteDocument: React.FC<Props> = ({ id, slug, disabled = false, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { deleteDocument } = useDocument();
  const { data, trigger, isMutating } = deleteDocument(id, slug);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    trigger();
  };

  useEffect(() => {
    if (data === undefined) return;
    enqueueSnackbar(t('toast.deleted_successfully'), { variant: 'success' });
    setOpen(false);
    onSuccess();
  }, [data]);

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
          <Button variant="contained" onClick={handleDelete} disabled={isMutating} autoFocus>
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

export default ComposeWrapper({ context: DocumentContextProvider })(DeleteDocument);
