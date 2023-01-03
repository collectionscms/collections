export type Mode = 'light' | 'dark';

export type ModeContext = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  autoMode: boolean;
};
