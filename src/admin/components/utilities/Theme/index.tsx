import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import React, { useMemo } from 'react';
import { createCustomTheme } from '../../../@extended/themes/createCustomTheme.js';
import { useColorMode } from '../ColorMode/index.js';

export const ThemeCustomization: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useColorMode();
  const themes = useMemo(() => createCustomTheme(mode), [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeCustomization;
