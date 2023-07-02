import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from '@mui/material';
import React from 'react';
import { themeDark } from '../../../themes/Dark/index.js';
import { theme } from '../../../themes/Default/index.js';
import { componentsOverrides } from '../../../themes/overrides/index.js';
import { useColorMode } from '../ColorMode/index.js';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useColorMode();
  const themes = mode === 'light' ? theme : themeDark;

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
