import { Theme } from '@mui/material';

export const ListItemButton = (theme: Theme) => {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: theme.palette.primary.main,
            borderRight: `2px solid ${theme.palette.primary.main}`,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.main,
            },
          },
        },
      },
    },
  };
};
