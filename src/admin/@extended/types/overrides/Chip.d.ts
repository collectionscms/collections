import * as Chip from '@mui/material/Chip';

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    light;
    combined;
  }
  interface ChipPropsSizeOverrides {
    large;
  }
}
