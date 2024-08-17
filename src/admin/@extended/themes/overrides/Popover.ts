import { Theme } from '@mui/material';

export const Popover = (theme: Theme) => {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.z1,
        },
      },
    },
  };
};
