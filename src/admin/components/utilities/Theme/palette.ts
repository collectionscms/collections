import { PaletteOptions } from '@mui/material/styles/createPalette';
import { Mode } from '.';

const Palette = (mode: Mode): PaletteOptions => ({
  mode,
  primary: {
    main: '#2F2F2F',
    light: '#585858',
    dark: '#050505',
  },
  secondary: {
    main: '#f44336',
    light: '#ff7961',
    dark: '#ba000d',
  },
});

export default Palette;
