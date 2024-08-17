import { Theme } from '@mui/material';

export const Tooltip = (theme: Theme) => {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: theme.palette.background.paper,
        },
      },
    },
  };
};
