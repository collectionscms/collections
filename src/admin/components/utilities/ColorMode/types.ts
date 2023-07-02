import { Mode } from '../../../../types/config.js';

export type ModeContext = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  autoMode: boolean;
};
