import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { DocumentInfoProvider } from '@admin/components/utilities/DocumentInfo';
import { settingsGroupNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const User = Loader(lazy(() => import('@admin/pages/User')));
const Role = Loader(lazy(() => import('@admin/pages/Role')));
const ContentType = Loader(lazy(() => import('@admin/pages/ContentType')));
const group = settingsGroupNavItems();

const SettingRoutes = {
  path: '/admin/settings',
  element: <MainLayout group={group} />,
  children: [
    { path: '', element: <Navigate to={group.items[0].href} replace /> },
    {
      path: 'content-types',
      element: (
        <DocumentInfoProvider
          label={group.items.find((group) => group.id == 'content-types').label}
        >
          <ContentType />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'users',
      element: (
        <DocumentInfoProvider label={group.items.find((group) => group.id == 'users').label}>
          <User />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'roles',
      element: (
        <DocumentInfoProvider label={group.items.find((group) => group.id == 'roles').label}>
          <Role />
        </DocumentInfoProvider>
      ),
    },
  ],
};

export default SettingRoutes;
