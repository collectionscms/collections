import MainLayout from '@admin/components/templates/MainLayout';
import Dashboard from '@admin/components/views/Dashboard';
import React from 'react';

const AppRoutes = {
  path: '/admin',
  element: <MainLayout />,
  children: [
    {
      path: '/admin',
      element: <Dashboard />,
    },
  ],
};

export default AppRoutes;
