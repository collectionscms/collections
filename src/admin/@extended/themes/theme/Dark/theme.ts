import { PalettesProps } from '@ant-design/colors';
import { PaletteColorOptions, SimplePaletteColorOptions } from '@mui/material';

export type PaletteThemeProps = {
  primary: SimplePaletteColorOptions;
  secondary: SimplePaletteColorOptions;
  error: SimplePaletteColorOptions;
  warning: SimplePaletteColorOptions;
  info: SimplePaletteColorOptions;
  success: SimplePaletteColorOptions;
  grey: PaletteColorOptions;
};

export const Theme = (colors: PalettesProps): PaletteThemeProps => {
  const { grey } = colors;
  const greyColors: PaletteColorOptions = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16],
  };
  const contrastText = '#fff';

  const primaryColors = [
    '#001b38',
    '#00315e',
    '#004985',
    '#0064ab',
    '#0a85d1',
    '#2fa1de',
    '#57bceb',
    '#83d6f7',
    '#b0ebff',
    '#e6f9ff',
  ];
  const errorColors = ['#341d1b', '#b03725', '#dd3f27', '#e9664d', '#fbd6c9'];
  const warningColors = ['#342a1a', '#83631a', '#dda116', '#e9ba3a', '#fbefb5'];
  const infoColors = ['#202734', '#416fb0', '#4c88dd', '#74a8e9', '#ecf4fb'];
  const successColors = ['#1f2e1c', '#449626', '#4fba28', '#74cf4d', '#e3fbd2'];

  return {
    primary: {
      lighter: primaryColors[0],
      100: primaryColors[1],
      200: primaryColors[2],
      light: primaryColors[3],
      400: primaryColors[4],
      main: primaryColors[5],
      dark: primaryColors[6],
      700: primaryColors[7],
      darker: primaryColors[8],
      900: primaryColors[9],
      contrastText,
    },
    secondary: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500]!,
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0],
    },
    error: {
      lighter: errorColors[0],
      light: errorColors[1],
      main: errorColors[2],
      dark: errorColors[3],
      darker: errorColors[4],
      contrastText,
    },
    warning: {
      lighter: warningColors[0],
      light: warningColors[1],
      main: warningColors[2],
      dark: warningColors[3],
      darker: warningColors[4],
      contrastText: greyColors[100],
    },
    info: {
      lighter: infoColors[0],
      light: infoColors[1],
      main: infoColors[2],
      dark: infoColors[3],
      darker: infoColors[4],
      contrastText,
    },
    success: {
      lighter: successColors[0],
      light: successColors[1],
      main: successColors[2],
      dark: successColors[3],
      darker: successColors[4],
      contrastText,
    },
    grey: greyColors,
  };
};
