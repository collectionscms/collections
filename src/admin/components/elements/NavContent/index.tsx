import { Box, Divider, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import {
  postNavItems,
  profileNavItems,
  settingsGroupNavItems,
} from '../../../utilities/groupNavItems.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { NavGroup } from '../NavGroup/index.js';
import { NavHeader } from '../NavHeader/index.js';
import { ScrollBar } from '../ScrollBar/index.js';
import { BottomContent } from './BottomContent/index.js';

export const NavContent: React.FC = () => {
  const { me } = useAuth();
  const theme = useTheme();

  const navHeader = useMemo(() => <NavHeader />, []);
  const bottomContent = useMemo(() => <BottomContent />, []);

  // todo
  const navGroupItems = me?.isAdmin
    ? [postNavItems(), settingsGroupNavItems(), profileNavItems()]
    : [postNavItems(), profileNavItems()];
  const navGroups = navGroupItems.map((group) => {
    return <NavGroup key={group.label} group={group} />;
  });

  return (
    <>
      <ScrollBar
        sx={{
          '& .simplebar-content': {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {navHeader}
        {navGroups}
      </ScrollBar>
      <Divider sx={{ mx: 1 }} />
      <Box
        sx={{
          marginTop: 'auto',
          bottom: '0px',
          width: '100%',
          py: '16px',
          px: '12px',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {bottomContent}
      </Box>
    </>
  );
};
