import { styled } from '@mui/material/styles/index.js';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Icon } from '../../elements/Icon/index.js';

// custom styles
const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
  '&.notistack-MuiContent-default': {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.grey[0],
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.palette.error.main,
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.palette.success.main,
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: theme.palette.info.main,
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: theme.palette.warning.main,
  },
}));

export const Snackbar = ({ children }: any) => {
  const style = { marginRight: 8, fontSize: '1.15rem' };

  return (
    <StyledSnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      iconVariant={{
        success: <Icon name="CircleCheck" size={16} classNames={{ marginRight: 4 }} />,
        error: <Icon name="CircleX" size={16} classNames={{ marginRight: 4 }} />,
        warning: <Icon name="TriangleAlert" size={16} classNames={{ marginRight: 4 }} />,
        info: <Icon name="Info" size={16} classNames={{ marginRight: 4 }} />,
      }}
      style={{ boxShadow: 'none' }}
    >
      {children}
    </StyledSnackbarProvider>
  );
};
