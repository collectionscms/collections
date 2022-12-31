import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import componentsOverrides from './overrides';
import Palette from './palette';
import Typography from './typography';

export type Mode = 'light' | 'dark';

export type ThemeContext = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  autoMode: boolean;
};

const localStorageKey = 'superfast-color-mode';

const initialContext: ThemeContext = {
  mode: 'light',
  setMode: () => null,
  autoMode: true,
};

const Context = createContext(initialContext);

const getMode = () => {
  let mode: Mode;
  const modeFromStorage = window.localStorage.getItem(localStorageKey);

  if (modeFromStorage === 'light' || modeFromStorage === 'dark') {
    mode = modeFromStorage;
  } else {
    mode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }

  return mode;
};

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>(getMode);
  const [autoMode, setAutoMode] = useState(() => {
    const modeFromStorage = window.localStorage.getItem(localStorageKey);
    return !modeFromStorage;
  });

  const setMode = useCallback((modeToSet: Mode | 'auto') => {
    if (modeToSet === 'light' || modeToSet === 'dark') {
      setAutoMode(false);
      setModeState(modeToSet);
      window.localStorage.setItem(localStorageKey, modeToSet);
    } else if (modeToSet === 'auto') {
      const existingModeFromStorage = window.localStorage.getItem(localStorageKey);
      if (existingModeFromStorage) window.localStorage.removeItem(localStorageKey);
      const modeFromOS =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      setAutoMode(true);
      setModeState(modeFromOS);
    }
  }, []);

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

  const value = useMemo(
    () => ({
      mode,
      setMode,
      autoMode,
    }),
    [mode, autoMode]
  );

  theme.components = componentsOverrides(theme);

  return (
    <Context.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Context.Provider>
  );
};

export const useTheme = (): ThemeContext => useContext(Context);

export default Context;
