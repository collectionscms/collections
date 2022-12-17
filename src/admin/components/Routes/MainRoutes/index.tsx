import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import List from '@admin/pages/collections/List';
import React, { lazy } from 'react';

const Dashboard = Loader(lazy(() => import('@admin/pages/Dashboard')));
const User = Loader(lazy(() => import('@admin/pages/User')));
const Role = Loader(lazy(() => import('@admin/pages/Role')));

// TODO Retrieve from DB
const collections = [{ type: 'Restaurant' }, { type: 'Menu' }];

const AppRoutes = {
  path: '/admin',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <Dashboard />,
    },
    ...collections.map((collection) => ({
      path: `contents/${collection.type}`,
      element: <List type={collection.type} />,
    })),
    {
      path: 'users',
      element: <User />,
    },
    {
      path: 'roles',
      element: <Role />,
    },
  ],
};

export default AppRoutes;
