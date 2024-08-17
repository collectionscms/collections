import '@mui/material/Slider';

declare module '@mui/material/Slider' {
  interface SliderPropsColorOverrides {
    error;
    success;
    warning;
    info;
  }
}
