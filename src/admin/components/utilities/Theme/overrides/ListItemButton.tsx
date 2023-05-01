import { Theme } from '@mui/material';

export const ListItemButton = (theme: Theme) => {
  return {
    MuiListItemButton: {
      defaultProps: {
        sx: {
          p: '4px 0 4px 24px',
        },
      },
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            borderRight: `2px solid ${theme.palette.primary.main}`,
          },
        },
      },
    },
  };
};
