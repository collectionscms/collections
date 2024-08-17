import { Theme } from '@mui/material';

export const ToggleButton = (theme: Theme) => {
  return {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            borderColor: theme.palette.divider,
            color: theme.palette.text.disabled,
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        },
      },
    },
  };
};
