import { AppBarProps, Dialog, IconButton, Stack, Toolbar, useTheme } from '@mui/material';
import React from 'react';
import { LocalizedPost } from '../../../../../../types/index.js';
import { Icon } from '../../../../../components/elements/Icon/index.js';
import { AppBarStyled } from '../../AppBarStyled.js';

export type Props = {
  open: boolean;
  post: LocalizedPost;
  onClose: () => void;
};

export const Settings: React.FC<Props> = ({ open, post, onClose }) => {
  const theme = useTheme();
  const appBar: AppBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: '100%',
    },
  };

  return (
    <Dialog
      open={open}
      fullScreen
      sx={{ '& .MuiDialog-paper': { bgcolor: 'background.paper', backgroundImage: 'none' } }}
    >
      <AppBarStyled open={true} {...appBar}>
        <Toolbar>
          <Stack
            direction="row"
            flexGrow={1}
            gap={2}
            justifyContent="flex-between"
            alignItems="center"
          >
            <IconButton color="secondary" onClick={onClose} sx={{ p: 0 }}>
              <Icon name="X" size={28} strokeWidth={1.5} />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBarStyled>
    </Dialog>
  );
};
