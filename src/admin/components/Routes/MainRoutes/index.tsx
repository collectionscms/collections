import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import React, { lazy } from 'react';

const Dashboard = Loader(lazy(() => import('@admin/pages/Dashboard')));
const User = Loader(lazy(() => import('@admin/pages/User')));

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
