import Sidebar from '@admin/components/elements/Sidebar';
import { Box } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Sidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
      <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
