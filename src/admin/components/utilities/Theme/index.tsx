import ColorModeContext from '@admin/components/elements/ToggleColor/context';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React, { useMemo, useState } from 'react';
import Palette from './palette';
import Typography from './typography';

export type Mode = 'light' | 'dark';

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const themePalette = Palette(mode);
  const themeTypography = Typography(
    [
      'Roboto',
      'Helvetica',
      'Arial',
      'Hiragino Kaku Gothic ProN',
      'Hiragino Sans',
      'Meiryo',
      'sans-serif',
    ].join(',')
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: themePalette,
        typography: themeTypography,
      }),
    [mode, themeTypography]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeContextProvider;
