import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import config from '@shared/features/config';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Props } from './types';

const Header: React.FC<Props> = ({ toggleDrawer }) => {
  const theme = useTheme();
  const { collection } = useParams();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  return lgUp ? (
    <AppBar color="inherit" sx={{ pl: `${config?.ui.navWidth}px` }}>
      <Toolbar>{collection}</Toolbar>
    </AppBar>
  ) : (
    <AppBar color="inherit">
      <Toolbar>
        <Stack direction="row" spacing={1}>
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
          {collection}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
