import { PalettesProps, presetDarkPalettes } from '@ant-design/colors';
import { PaletteOptions, alpha } from '@mui/material';
import { Theme } from './theme.js';

const greyPrimary = [
  '#000000',
  '#141414',
  '#1e1e1e',
  '#595959',
  '#8c8c8c',
  '#bfbfbf',
  '#d9d9d9',
  '#f0f0f0',
  '#f5f5f5',
  '#fafafa',
  '#ffffff',
];
const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
const greyConstant = ['#121212', '#d3d8db'];

const colors: PalettesProps = presetDarkPalettes;
colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

const paletteColor = Theme(colors);

export const palette: PaletteOptions = {
  mode: 'dark',
  common: {
    black: '#000',
    white: '#fff',
  },
  ...paletteColor,
  text: {
    primary: alpha(paletteColor.grey[900]!, 0.87),
    secondary: alpha(paletteColor.grey[900]!, 0.45),
    disabled: alpha(paletteColor.grey[900]!, 0.1),
  },
  action: {
    disabled: paletteColor.grey[300],
  },
  divider: alpha(paletteColor.grey[900]!, 0.05),
  background: {
    paper: paletteColor.grey[100],
    default: paletteColor.grey.A50,
  },
};
