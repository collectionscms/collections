import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { Props } from './types';

const NavHeader: React.FC<Props> = ({ toggleDrawer }) => {
  const theme = useTheme();
  const lgDown = useMediaQuery(theme.breakpoints.down('lg'));

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

  return lgDown && <AppBar color="inherit">{mainHeader}</AppBar>;
};

export default NavHeader;
