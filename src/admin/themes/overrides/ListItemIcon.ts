import { Theme } from '@mui/material';

export const ListItemIcon = (theme: Theme) => {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 24,
          color: theme.palette.text.primary,
        },
      },
    },
  };
};
