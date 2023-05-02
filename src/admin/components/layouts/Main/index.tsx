import { Box, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Nav } from '../../elements/Nav/index.js';
import { NavHeader } from '../../elements/NavHeader/index.js';
import { Props } from './types.js';

export const MainLayout: React.FC<Props> = ({ group }) => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <NavHeader toggleDrawer={toggleDrawer} />
      <Nav open={open} group={group} toggleDrawer={toggleDrawer} />
      <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ minHeight: { lg: 0 } }} />
        <Outlet />
      </Box>
    </Box>
  );
};
