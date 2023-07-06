import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from '@mui/material';
import React, { useMemo } from 'react';
import { createCustomTheme } from 'superfast-ui';
import { useColorMode } from '../ColorMode/index.js';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useColorMode();
  const themes = useMemo(() => createCustomTheme(mode), [mode]);

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
