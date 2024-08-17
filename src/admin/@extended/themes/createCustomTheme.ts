import { Theme, createTheme } from '@mui/material';
import { ThemeMode } from '../types/config';
import { CustomShadowProps } from '../types/theme.js';
import { componentsOverrides } from './overrides/index.js';
import { CustomShadows } from './shadows.js';
import { themeDark } from './theme/Dark/index.js';
import { themeLight } from './theme/Default/index.js';
import { Typography } from './typography.js';

export const createCustomTheme = (mode: ThemeMode): Theme => {
  const theme: Theme = mode === 'dark' ? themeDark : themeLight;

  const themeCustomShadows: CustomShadowProps = CustomShadows(mode, theme);
  const themeTypography = Typography();

  const themeOptions = {
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1266,
        xl: 1440,
      },
    },
    mixins: {
      toolbar: {
        minHeight: 60,
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
    palette: theme.palette,
    customShadows: themeCustomShadows,
    typography: themeTypography,
  };

  const themes = createTheme(themeOptions);
  themes.components = componentsOverrides(themes);

  return themes;
};
