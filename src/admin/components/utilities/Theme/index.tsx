import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import React from 'react';
import { useColorMode } from '../ColorMode/index.js';
import { themeDark } from './Dark/index.js';
import { theme } from './Default/index.js';
import { componentsOverrides } from './overrides/index.js';

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
