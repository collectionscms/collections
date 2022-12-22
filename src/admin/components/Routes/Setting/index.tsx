import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { settingsGroupNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const User = Loader(lazy(() => import('@admin/pages/User')));
const Role = Loader(lazy(() => import('@admin/pages/Role')));
const groups = settingsGroupNavItems();

const SettingRoutes = {
  path: '/admin/settings',
  element: <MainLayout groups={groups} />,
  children: [
    { path: '', element: <Navigate to={groups[0].items[0].href} replace /> },
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

export default SettingRoutes;
