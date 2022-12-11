import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import config from '@shared/features/config';
import React from 'react';
import { Props } from './types';

const Header: React.FC<Props> = ({ toggleDrawer }) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const mainHeader = (
    <Toolbar>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          display: {
            xs: 'inline-flex',
            lg: 'none',
          },
        }}
      >
        <MenuIcon fontSize="small" />
      </IconButton>
    </Toolbar>
  );

  return lgUp ? (
    <AppBar color="inherit" sx={{ pl: `${config?.ui.navWidth}px` }}>
      <Toolbar>
        <SearchIcon fontSize="small" />
      </Toolbar>
    </AppBar>
  ) : (
    <AppBar color="inherit">{mainHeader}</AppBar>
  );
};

export default Header;
