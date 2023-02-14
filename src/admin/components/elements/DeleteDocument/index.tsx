import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { DocumentContextProvider, useDocument } from '@admin/stores/Document';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from './types';

const DeleteDocument: React.FC<Props> = ({ id, slug, openState, onSuccess, onClose }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { deleteDocument } = useDocument();
  const { data, trigger, error, reset, isMutating } = deleteDocument(id, slug);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    trigger();
  };

  useEffect(() => {
    if (data === undefined) return;
    enqueueSnackbar(t('toast.deleted_successfully'), { variant: 'success' });
    onSuccess();
    reset();
  }, [data]);

  return (
    <Dialog
      open={openState}
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
  );
};

export default ComposeWrapper({ context: DocumentContextProvider })(DeleteDocument);
