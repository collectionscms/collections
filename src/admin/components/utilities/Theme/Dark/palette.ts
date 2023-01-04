import { PaletteOptions } from '@mui/material';
import { colorBase } from '../colors';

const palette: PaletteOptions = {
  mode: 'dark',
  primary: { main: colorBase.color_base_0 },
  secondary: { main: '#eaff96' },
  background: {
    default: colorBase.color_base_900,
    paper: colorBase.color_base_900,
  },
  sidebar: { main: colorBase.color_base_800 },
  sidebarIcon: { main: colorBase.color_base_600 },
};

export default palette;
