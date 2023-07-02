import { PalettesProps, presetPalettes } from '@ant-design/colors';
import { PaletteOptions, alpha } from '@mui/material';
import { Theme } from './theme.js';

const greyPrimary = [
  '#ffffff',
  '#fafafa',
  '#f5f5f5',
  '#f0f0f0',
  '#d9d9d9',
  '#bfbfbf',
  '#8c8c8c',
  '#595959',
  '#262626',
  '#141414',
  '#000000',
];
const greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
const greyConstant = ['#fafafb', '#e6ebf1'];

const colors: PalettesProps = presetPalettes;
colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

const paletteColor = Theme(colors);

export const palette: PaletteOptions = {
  mode: 'light',
  common: {
    black: '#000',
    white: '#fff',
  },
  ...paletteColor,
  text: {
    primary: paletteColor.grey[700],
    secondary: paletteColor.grey[500],
    disabled: paletteColor.grey[400],
  },
  action: {
    disabled: paletteColor.grey[300],
  },
  divider: paletteColor.grey[200],
  background: {
    paper: paletteColor.grey[0],
    default: paletteColor.grey.A50,
  },
};
