import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { DocumentInfoProvider } from '@admin/components/utilities/DocumentInfo';
import { settingsGroupNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Project = Loader(lazy(() => import('@admin/pages/Project')));
const User = Loader(lazy(() => import('@admin/pages/User')));
const EditUser = Loader(lazy(() => import('@admin/pages/User/Edit')));
const Role = Loader(lazy(() => import('@admin/pages/Role')));
const EditRole = Loader(lazy(() => import('@admin/pages/Role/Edit')));
const ContentType = Loader(lazy(() => import('@admin/pages/ContentType')));
const EditContentType = Loader(lazy(() => import('@admin/pages/ContentType/Edit')));
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

    // /////////////////////////////////////
    // Content Types
    // /////////////////////////////////////
    {
      path: 'content-types',
      element: (
        <DocumentInfoProvider {...props('content-types')}>
          <ContentType />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'content-types/create',
      element: (
        <DocumentInfoProvider {...props('content-types')}>
          <EditContentType />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'content-types/:id',
      element: (
        <DocumentInfoProvider {...props('content-types')}>
          <EditContentType />
        </DocumentInfoProvider>
      ),
    },

    // /////////////////////////////////////
    // Users
    // /////////////////////////////////////
    {
      path: 'users',
      element: (
        <DocumentInfoProvider {...props('users')}>
          <User />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'users/create',
      element: (
        <DocumentInfoProvider {...props('users')}>
          <EditUser />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'users/:id',
      element: (
        <DocumentInfoProvider {...props('users')}>
          <EditUser />
        </DocumentInfoProvider>
      ),
    },

    // /////////////////////////////////////
    // Roles
    // /////////////////////////////////////
    {
      path: 'roles',
      element: (
        <DocumentInfoProvider {...props('roles')}>
          <Role />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'roles/create',
      element: (
        <DocumentInfoProvider {...props('roles')}>
          <EditRole />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'roles/:id',
      element: (
        <DocumentInfoProvider {...props('roles')}>
          <EditRole />
        </DocumentInfoProvider>
      ),
    },
  ],
};

export default SettingRoutes;
