import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { Props } from './types';

export const UnsavedDialog: React.FC<Props> = ({ open, onConfirm, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('dialog.unsaved_changes_title')}</DialogTitle>
      <DialogContent id="alert-dialog-description">
        <DialogContentText>{t('dialog.unsaved_changes')}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onConfirm}>{t('dialog.discard_changes')}</Button>
        <Button variant="contained" onClick={onClose} autoFocus>
          {t('dialog.keep_editing')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
