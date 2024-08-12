import {
  Button,
  ButtonOwnProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import React, { ReactNode } from 'react';

type Action = {
  action: () => void;
  label: string;
};

export type Props = {
  open: boolean;
  title: string;
  body: ReactNode;
  confirm: Action;
  cancel: Action;
  color?: ButtonOwnProps['color'];
};

export const ModalDialog: React.FC<Props> = ({ open, title, body, confirm, cancel, color }) => {
  return (
    <Dialog open={open} onClose={cancel.action}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={cancel.action} color="secondary" variant="outlined">
          {cancel.label}
        </Button>
        <Button variant="contained" onClick={confirm.action} color={color || 'primary'}>
          {confirm.label}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
