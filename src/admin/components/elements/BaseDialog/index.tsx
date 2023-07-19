import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import { Props } from './types.js';

export const BaseDialog: React.FC<Props> = ({ open, title, body, confirm, cancel }) => {
  return (
    <Dialog
      open={open}
      onClose={cancel.action}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent id="alert-dialog-description">
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={cancel.action} autoFocus color="secondary">
          {cancel.label}
        </Button>
        <Button variant="contained" onClick={confirm.action}>
          {confirm.label}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
