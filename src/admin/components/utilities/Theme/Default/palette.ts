import { PaletteOptions } from '@mui/material';
import { colorBase } from '../colors';

const palette: PaletteOptions = {
  mode: 'light',
  primary: { main: colorBase.color_base_800 },
  background: {
    default: colorBase.color_base_0,
    paper: colorBase.color_base_0,
  },
  sidebar: { main: colorBase.color_base_700 },
  sidebarIcon: { main: colorBase.color_base_400 },
};

export default palette;
