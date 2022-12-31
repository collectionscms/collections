import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import React from 'react';
import { useColorMode } from '../ColorMode';
import themeDark from './Dark';
import theme from './Default';
import componentsOverrides from './overrides';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useColorMode();
  const themes = mode === 'light' ? theme : themeDark;

  themes.components = componentsOverrides(themes);

  return (
    <MuiThemeProvider theme={themes}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
