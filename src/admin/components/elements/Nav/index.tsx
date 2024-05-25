import { Box, Drawer, Stack, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import {
  postNavItems,
  profileNavItems,
  settingsGroupNavItems,
} from '../../../utilities/groupNavItems.js';
import { NavContent } from '../NavContent/index.js';
import { Sidebar } from '../Sidebar/index.js';
import { MinimalStyled } from './minimal.js';

type Props = {
  window?: () => Window;
  open: boolean;
  variable: 'portal' | 'profile' | 'tenant';
  toggleDrawer: () => void;
};

export const Nav: React.FC<Props> = ({ window, open, variable, toggleDrawer }) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const navWidth = variable === 'portal' ? 60 : 300;

  const tenantGroups = [postNavItems(), settingsGroupNavItems()];
  const profileGroups = [profileNavItems()];

  const container = window !== undefined ? () => window().document.body : undefined;
  const sidebar = useMemo(
    () => (
      <Stack direction="row">
        <Sidebar />
        {variable === 'profile' && (
          <Box sx={{ width: 240, borderLeft: `1px solid ${theme.palette.divider}` }}>
            <NavContent navGroupItems={profileGroups} />
          </Box>
        )}
        {variable === 'tenant' && (
          <Box sx={{ width: 240, borderLeft: `1px solid ${theme.palette.divider}` }}>
            <NavContent navGroupItems={tenantGroups} />
          </Box>
        )}
      </Stack>
    ),
    []
  );

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1200 }}>
      {lgUp ? (
        <MinimalStyled variant="permanent" sx={{ width: navWidth }}>
          {sidebar}
        </MinimalStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: navWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              boxShadow: 'inherit',
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}
    </Box>
  );
};
