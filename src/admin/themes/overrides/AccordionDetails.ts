import { Theme } from '@mui/material';

export const AccordionDetails = (theme: Theme) => {
  return {
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2),
          borderTop: `1px solid ${theme.palette.secondary.light}`,
        },
      },
    },
  };
};
