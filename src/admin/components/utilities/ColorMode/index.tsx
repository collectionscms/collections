import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Mode, ModeContext } from './types.js';

const localStorageKey = 'superfast-color-mode';

const initialContext: ModeContext = {
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

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const value = useMemo(
    () => ({
      mode,
      setMode,
      autoMode,
    }),
    [mode, autoMode]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useColorMode = (): ModeContext => useContext(Context);

export default Context;
