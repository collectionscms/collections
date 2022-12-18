import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  BoxProps,
  Button,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import config from '@shared/features/config';
import React from 'react';
import { useLocation } from 'react-router-dom';
import RouterLink from '../../Link';
import { Props } from './types';

const Item = (props: BoxProps) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    />
  );
};

const Header: React.FC<Props> = ({ toggleDrawer }) => {
  const theme = useTheme();
  const location = useLocation();
  const collectionType = location.pathname.split('/').pop();
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Item>
            <h1>{collectionType}</h1>
          </Item>
          <Item>
            <Button
              variant="contained"
              component={RouterLink}
              to={`/admin/collections/${collectionType}/create`}
            >
              登録
            </Button>
          </Item>
        </Box>
      </Toolbar>
    </AppBar>
  ) : (
    <AppBar color="inherit">{mainHeader}</AppBar>
  );
};

export default Header;
