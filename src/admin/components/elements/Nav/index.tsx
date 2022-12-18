import groupSidebarItems from '@admin/utilities/groupNavItems';
import { Box, Drawer, Link, useMediaQuery, useTheme } from '@mui/material';
import config from '@shared/features/config';
import React, { useEffect } from 'react';
import RouterLink from '../Link';
import Logo from '../Logo';
import NavAction from '../NavAction';
import NavGroup from '../NavGroup';
import NavItem from '../NavItem';
import ToggleColor from '../ToggleColor';
import Minimal from './minimal';
import { Props } from './types';

const NavHeader = () => {
  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        alignItems: 'left',
        fontSize: 20,
        p: 3,
      }}
    >
      <Link component={RouterLink} to="/admin">
        <Logo />
      </Link>
    </Box>
  );
};

const NavItemContent = () => {
  const groups = groupSidebarItems([{ type: 'Restaurant' }, { type: 'Menu' }]);

  return (
    <Box component="nav" sx={{ overflow: 'auto' }}>
      {groups.map((group) => (
        <NavGroup group={group} key={group.id}>
          {group.items.map((item) => (
            <NavItem item={item} key={item.id} />
          ))}
        </NavGroup>
      ))}
    </Box>
  );
};

const NavContent = () => {
  const theme = useTheme();

  return (
    <>
      <NavHeader />
      <NavItemContent />
      <ToggleColor />
      <Box
        sx={{
          position: 'absolute',
          bottom: '0px',
          p: 3,
          width: '100%',
          background: theme.palette.background.default,
          zIndex: theme.zIndex.appBar + 100,
        }}
      >
        <NavAction />
      </Box>
    </>
  );
};

const Nav: React.FC<Props> = ({ open, toggleDrawer }) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (open) {
      toggleDrawer?.();
    }
  }, []);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: theme.zIndex.appBar + 200 }}>
      {lgUp ? (
        <Minimal variant="permanent" open={open}>
          <NavContent />
        </Minimal>
      ) : (
        <Drawer
          anchor="left"
          onClose={toggleDrawer}
          open={open}
          PaperProps={{
            sx: {
              width: config?.ui.navWidth,
            },
          }}
          sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
          variant="temporary"
        >
          <NavContent />
        </Drawer>
      )}
    </Box>
  );
};

export default Nav;
