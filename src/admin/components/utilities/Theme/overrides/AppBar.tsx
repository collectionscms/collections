import { Theme } from '@mui/material';

export const AppBar = (theme: Theme) => {
  return {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        sx: {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    },
  };
};
