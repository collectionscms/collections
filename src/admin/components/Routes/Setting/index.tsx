import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { DocumentInfoProvider } from '@admin/components/utilities/DocumentInfo';
import { settingsGroupNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Project = Loader(lazy(() => import('@admin/pages/Project')));
const User = Loader(lazy(() => import('@admin/pages/User')));
const Role = Loader(lazy(() => import('@admin/pages/Role')));
const ContentType = Loader(lazy(() => import('@admin/pages/ContentType')));
const group = settingsGroupNavItems();

const props = (id: string) => {
  const item = group.items.find((group) => group.id == id);
  return { label: item.label, fields: item.fields };
};

const SettingRoutes = {
  path: '/admin/settings',
  element: <MainLayout group={group} />,
  children: [
    { path: '', element: <Navigate to={group.items[0].href} replace /> },
    {
      path: 'project',
      element: (
        <DocumentInfoProvider {...props('project')}>
          <Project />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'content-types',
      element: (
        <DocumentInfoProvider {...props('content-types')}>
          <ContentType />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'users',
      element: (
        <DocumentInfoProvider {...props('users')}>
          <User />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'roles',
      element: (
        <DocumentInfoProvider {...props('roles')}>
          <Role />
        </DocumentInfoProvider>
      ),
    },
  ],
};

export default SettingRoutes;
