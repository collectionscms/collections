import { AppBar, AppBarProps, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { Icon } from '../Icon/index.js';
import { AppBarStyled } from './styled.js';
import { Props } from './types.js';

export const Header: React.FC<Props> = ({ open, toggleDrawer }) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

  const mainHeader: ReactNode = (
    <Toolbar>
      {!lgUp ? (
        <IconButton
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          color="secondary"
          variant="light"
          sx={{
            color: 'text.primary',
            bgcolor: open ? iconBackColorOpen : iconBackColor,
            ml: { xs: 0, lg: -2 },
          }}
        >
          <Icon name="Menu" size={24} />
        </IconButton>
      ) : (
        <></>
      )}
    </Toolbar>
  );

  const appBar: AppBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
    },
  };

  return <>{lgUp ? <AppBarStyled {...appBar} /> : <AppBar {...appBar}>{mainHeader}</AppBar>}</>;
};
