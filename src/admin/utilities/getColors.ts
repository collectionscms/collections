import { Theme } from '@mui/material';
import { ColorProps } from '../../types/mui/style.js';

export const getColors = (theme: Theme, color?: ColorProps) => {
  switch (color!) {
    case 'secondary':
      return theme.palette.secondary;
    case 'error':
      return theme.palette.error;
    case 'warning':
      return theme.palette.warning;
    case 'info':
      return theme.palette.info;
    case 'success':
      return theme.palette.success;
    default:
      return theme.palette.primary;
  }
};
