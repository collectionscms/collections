import { Theme } from '@mui/material';

export const DialogContentText = (theme: Theme) => {
  return {
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: theme.palette.text.primary,
        },
      },
    },
  };
};
