import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  Theme,
  ThemeOptions,
  createTheme,
} from '@mui/material';
import React, { useMemo } from 'react';
import { themeDark } from '../../../themes/Dark/index.js';
import { theme as themeLight } from '../../../themes/Default/index.js';
import { componentsOverrides } from '../../../themes/overrides/index.js';
import { CustomShadowProps, CustomShadows } from '../../../themes/shadows.js';
import { useColorMode } from '../ColorMode/index.js';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useColorMode();
  const theme: Theme = mode === 'light' ? themeLight : themeDark;

  const customShadows = useMemo<CustomShadowProps>(() => CustomShadows(mode, theme), [theme]);

  const themeOptions: ThemeOptions = useMemo(
    () => ({
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
      customShadows: customShadows,
    }),
    [theme, customShadows]
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverrides(themes);

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProvider;
