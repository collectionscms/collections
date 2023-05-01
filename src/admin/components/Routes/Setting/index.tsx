import React from 'react';
import { Navigate } from 'react-router-dom';
import { settingsGroupNavItems } from '../../../utilities/groupNavItems.js';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { DocumentInfoProvider } from '../../utilities/DocumentInfo/index.js';

const Project = Loader(lazy(() => import('../../../pages/Project/index.js'), 'Project'));
const Role = Loader(lazy(() => import('../../../pages/Role/index.js'), 'RolePage'));
const CreateRole = Loader(
  lazy(() => import('../../../pages/Role/Create/index.js'), 'CreateRolePage')
);
const EditRole = Loader(lazy(() => import('../../../pages/Role/Edit/index.js'), 'EditRolePage'));
const ContentType = Loader(
  lazy(() => import('../../../pages/ContentType/index.js'), 'ContentTypePage')
);
const CreateContentType = Loader(
  lazy(() => import('../../../pages/ContentType/Create/index.js'), 'CreateContentTypePage')
);
const EditContentType = Loader(
  lazy(() => import('../../../pages/ContentType/Edit/index.js'), 'EditContentTypePage')
);
const User = Loader(lazy(() => import('../../../pages/User/index.js'), 'UserPage'));
const CreateUser = Loader(
  lazy(() => import('../../../pages/User/Create/index.js'), 'CreateUserPage')
);
const EditUser = Loader(lazy(() => import('../../../pages/User/Edit/index.js'), 'EditUserPage'));
const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));
const group = settingsGroupNavItems();

export const SettingRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return {
      path: '/admin/settings',
      children: [
        { path: '', element: <Navigate to="/admin/auth/login" replace /> },
        { path: '*', element: <Navigate to="/admin/auth/login" replace /> },
      ],
    };
  }

  if (!user.adminAccess) {
    return {
      path: '/admin/settings',
      children: [
        { path: '', element: <NotFound /> },
        { path: '*', element: <NotFound /> },
      ],
    };
  }

  return {
    path: '/admin/settings',
    element: <MainLayout group={group} />,
    children: [
      { path: '', element: <Navigate to={group.items[0].href} replace /> },
      {
        path: 'project',
        element: (
          <DocumentInfoProvider label="project_setting">
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
          <DocumentInfoProvider label="content_type">
            <ContentType />
          </DocumentInfoProvider>
        ),
      },
      {
        path: 'content-types/create',
        element: (
          <DocumentInfoProvider label="create.content_type">
            <CreateContentType />
          </DocumentInfoProvider>
        ),
      },
      {
        path: 'content-types/:id',
        element: (
          <DocumentInfoProvider label="edit.content_type">
            <EditContentType />
          </DocumentInfoProvider>
        ),
      },

      // /////////////////////////////////////
      // Roles
      // /////////////////////////////////////
      {
        path: 'roles',
        element: (
          <DocumentInfoProvider label="role">
            <Role />
          </DocumentInfoProvider>
        ),
      },
      {
        path: 'roles/create',
        element: (
          <DocumentInfoProvider label="create.role">
            <CreateRole />
          </DocumentInfoProvider>
        ),
      },
      {
        path: 'roles/:id',
        element: (
          <DocumentInfoProvider label="edit.role">
            <EditRole />
          </DocumentInfoProvider>
        ),
      },

      // /////////////////////////////////////
      // Users
      // /////////////////////////////////////
      {
        path: 'users',
        element: (
          <DocumentInfoProvider label="user">
            <User />
          </DocumentInfoProvider>
        ),
      },
      {
        path: 'users/create',
        element: (
          <DocumentInfoProvider label="create.user">
            <CreateUser />
          </DocumentInfoProvider>
        ),
      },
      {
        path: 'users/:id',
        element: (
          <DocumentInfoProvider label="edit.user">
            <EditUser />
          </DocumentInfoProvider>
        ),
      },
    ],
  };
};
