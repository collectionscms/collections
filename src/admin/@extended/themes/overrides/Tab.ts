import { Theme } from '@mui/material';

export const Tab = (theme: Theme) => {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 46,
          color: theme.palette.text.primary,
          borderRadius: 4,
          '&:hover': {
            backgroundColor: theme.palette.primary.lighter + 60,
            color: theme.palette.primary.main,
          },
          '&:focus-visible': {
            borderRadius: 4,
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: -3,
          },
        },
      },
    },
  };
};
