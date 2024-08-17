import { alpha } from '@mui/material';

export const Dialog = () => {
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: alpha('#000', 0.7),
          },
        },
      },
    },
  };
};
