export declare module '@mui/material/styles' {
  interface Palette {
    sidebar: Palette['primary'];
    sidebarIcon: Palette['primary'];
  }

  interface PaletteOptions {
    sidebar?: PaletteOptions['primary'];
    sidebarIcon?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    sidebarIcon: true;
  }
}
