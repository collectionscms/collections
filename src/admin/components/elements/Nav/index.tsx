import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { config } from '../../../../config/ui.js';
import { NavContent } from '../NavContent/index.js';
import { MinimalStyled } from './minimal.js';
import { Props } from './types.js';

export const Nav: React.FC<Props> = ({ window, open, toggleDrawer }) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const container = window !== undefined ? () => window().document.body : undefined;
  const navContent = useMemo(() => <NavContent />, []);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1200 }}>
      {lgUp ? (
        <MinimalStyled variant="permanent">{navContent}</MinimalStyled>
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
              width: config.ui.navWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              boxShadow: 'inherit',
            },
          }}
        >
          {navContent}
        </Drawer>
      )}
    </Box>
  );
};
