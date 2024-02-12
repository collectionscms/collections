import { Theme } from '@mui/material';

export const ListItemButton = (theme: Theme) => {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: theme.palette.text.primary,
            borderRight: `2px solid ${theme.palette.text.primary}`,
            '& .MuiListItemIcon-root': {
              color: theme.palette.text.primary,
            },
          },
        },
      },
    },
  };
};
