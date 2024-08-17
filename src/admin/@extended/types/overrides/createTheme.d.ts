import * as Theme from '@mui/material';
import { CustomShadowProps } from '../theme.js';

declare module '@mui/material' {
  interface Theme {
    customShadows: CustomShadowProps;
  }
}
