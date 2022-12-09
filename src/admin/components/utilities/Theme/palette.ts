import { PaletteOptions } from '@mui/material/styles/createPalette';
import { Mode } from '.';

const Palette = (mode: Mode): PaletteOptions => ({
  mode,
});

export default Palette;
