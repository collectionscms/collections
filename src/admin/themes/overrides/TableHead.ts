import { Theme } from '@mui/material';

export const TableHead = (theme: Theme) => {
  return {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[50],
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `2px solid ${theme.palette.divider}`,
        },
      },
    },
  };
};
