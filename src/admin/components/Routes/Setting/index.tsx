import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { settingsGroupNavItems } from '../../../utilities/groupNavItems';
import Loader from '../../elements/Loader';
import MainLayout from '../../layouts/Main';
import { useAuth } from '../../utilities/Auth';
import { DocumentInfoProvider } from '../../utilities/DocumentInfo';

const Project = Loader(lazy(() => import('../../../pages/Project')));
const Role = Loader(lazy(() => import('../../../pages/Role')));
const CreateRole = Loader(lazy(() => import('../../../pages/Role/Create')));
const EditRole = Loader(lazy(() => import('../../../pages/Role/Edit')));
const ContentType = Loader(lazy(() => import('../../../pages/ContentType')));
const CreateContentType = Loader(lazy(() => import('../../../pages/ContentType/Create')));
const EditContentType = Loader(lazy(() => import('../../../pages/ContentType/Edit')));
const User = Loader(lazy(() => import('../../../pages/User')));
const CreateUser = Loader(lazy(() => import('../../../pages/User/Create')));
const EditUser = Loader(lazy(() => import('../../../pages/User/Edit')));
const NotFound = Loader(lazy(() => import('../../../pages/NotFound')));
const group = settingsGroupNavItems();

const SettingRoutes = () => {
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

export default SettingRoutes;
