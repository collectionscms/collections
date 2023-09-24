import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from './types.js';

export const ConfirmDiscardDialog: React.FC<Props> = ({ open, onDiscard, onKeepEditing }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onKeepEditing}>
      <DialogTitle>{t('dialog.unsaved_changes_title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('dialog.unsaved_changes')}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onDiscard} color="secondary">
          {t('dialog.discard_changes')}
        </Button>
        <Button variant="contained" onClick={onKeepEditing} autoFocus>
          {t('dialog.keep_editing')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
