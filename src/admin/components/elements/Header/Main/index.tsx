import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, Box, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import config from '@shared/features/config';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Props } from './types';

const Header: React.FC<Props> = ({ toggleDrawer }) => {
  const theme = useTheme();
  const location = useLocation();
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
        <FontAwesomeIcon icon={faBars} />
      </IconButton>
    </Toolbar>
  );

  return lgUp ? (
    <AppBar color="inherit" sx={{ pl: `${config?.ui.navWidth}px` }}>
      <Toolbar>
        <Box component="header">{location.pathname}</Box>
      </Toolbar>
    </AppBar>
  ) : (
    <AppBar color="inherit">{mainHeader}</AppBar>
  );
};

export default Header;
