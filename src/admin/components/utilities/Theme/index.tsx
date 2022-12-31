import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import React, { useMemo } from 'react';
import { useColorMode } from '../ColorMode';
import componentsOverrides from './overrides';
import Palette from './palette';
import Typography from './typography';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useColorMode();

  const themePalette = Palette(mode);
  const themeTypography = Typography(
    ['Roboto', 'Noto Sans JP', 'Helvetica', 'Arial', 'Meiryo', 'sans-serif'].join(',')
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: themePalette,
        typography: themeTypography,
      }),
    [mode, themeTypography]
  );

  theme.components = componentsOverrides(theme);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
