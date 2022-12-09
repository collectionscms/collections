import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import config from '@shared/features/config';
import React from 'react';
import ToggleColor from '../ToggleColor';
import Minimal from './minimal';
import { Props } from './types';

const Content = () => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          alignItems: 'left',
          fontSize: 20,
          p: 3,
        }}
      >
        <p>Superfast</p>
      </Box>
      <ToggleColor />
    </>
  );
};

const MainDrawer: React.FC<Props> = ({ open, onClose }) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }}>
      {lgUp ? (
        <Minimal variant="permanent" open={open}>
          <Content />
        </Minimal>
      ) : (
        <Drawer
          anchor="left"
          onClose={onClose}
          open={open}
          PaperProps={{
            sx: {
              width: config?.ui.sidebarWidth,
            },
          }}
          sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
          variant="temporary"
        >
          <Content />
        </Drawer>
      )}
    </Box>
  );
};

export default MainDrawer;
