import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/templates/MainLayout';
import React, { lazy } from 'react';

const Dashboard = Loader(lazy(() => import('@admin/components/views/Dashboard')));

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
