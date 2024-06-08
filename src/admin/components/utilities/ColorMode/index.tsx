import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Mode, ModeContext } from './types.js';
import Cookies from 'js-cookie';

const colorModeKey = 'collections-color-mode';

const initialContext: ModeContext = {
  mode: 'light',
  setMode: () => null,
  autoMode: true,
};

const Context = createContext(initialContext);

const getMode = () => {
  let mode: Mode;
  const modeFromStorage = Cookies.get(colorModeKey);

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
    const modeFromStorage = Cookies.get(colorModeKey);
    return !modeFromStorage;
  });
  const domain = window.location.hostname.split('.').slice(-2).join('.');

  const setMode = useCallback((modeToSet: Mode | 'auto') => {
    if (modeToSet === 'light' || modeToSet === 'dark') {
      setAutoMode(false);
      setModeState(modeToSet);
      Cookies.set(colorModeKey, modeToSet, {
        domain: `.${domain}`,
      });
    } else if (modeToSet === 'auto') {
      const modeFromStorage = Cookies.get(colorModeKey);
      if (modeFromStorage) Cookies.remove(colorModeKey, { domain: `.${domain}` });
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
