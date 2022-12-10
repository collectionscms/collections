import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import User from '@admin/components/views/User';
import React, { lazy } from 'react';

const Dashboard = Loader(lazy(() => import('@admin/components/views/Dashboard')));

const AppRoutes = {
  path: '/admin',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <Dashboard />,
    },
    {
      path: 'users',
      element: <User />,
    },
  ],
};

export default AppRoutes;
