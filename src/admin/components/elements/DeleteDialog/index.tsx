import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import React from 'react';
import { Avatar } from '../../../@extended/components/Avatar/index.js';
import { Icon } from '../Icon/index.js';
import { Props } from './types.js';

export const DeleteDialog: React.FC<Props> = ({ open, title, body, confirm, cancel }) => {
  return (
    <Dialog open={open} onClose={cancel.action} keepMounted maxWidth="xs">
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Icon name="Trash2" size={32} />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              {title}
            </Typography>
            <Typography align="center">{body}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button
              fullWidth
              onClick={cancel.action}
              color="secondary"
              variant="outlined"
              autoFocus
            >
              {cancel.label}
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={confirm.action}>
              {confirm.label}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
