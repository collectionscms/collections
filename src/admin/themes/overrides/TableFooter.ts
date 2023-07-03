import { Theme } from '@mui/material';

export const TableFooter = (theme: Theme) => {
  return {
    MuiTableFooter: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[50],
          borderTop: `2px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    },
  };
};
