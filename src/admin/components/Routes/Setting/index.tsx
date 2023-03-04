import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loader from '../../../components/elements/Loader';
import Loading from '../../../components/elements/Loading';
import MainLayout from '../../../components/layouts/Main';
import MinimalLayout from '../../../components/layouts/Minimal';
import { useAuth } from '../../../components/utilities/Auth';
import { DocumentInfoProvider } from '../../../components/utilities/DocumentInfo';
import { settingsGroupNavItems } from '../../../utilities/groupNavItems';

const Project = Loader(lazy(() => import('@admin/pages/Project')));
const Role = Loader(lazy(() => import('@admin/pages/Role')));
const CreateRole = Loader(lazy(() => import('@admin/pages/Role/Create')));
const EditRole = Loader(lazy(() => import('@admin/pages/Role/Edit')));
const ContentType = Loader(lazy(() => import('@admin/pages/ContentType')));
const CreateContentType = Loader(lazy(() => import('@admin/pages/ContentType/Create')));
const EditContentType = Loader(lazy(() => import('@admin/pages/ContentType/Edit')));
const User = Loader(lazy(() => import('@admin/pages/User')));
const CreateUser = Loader(lazy(() => import('@admin/pages/User/Create')));
const EditUser = Loader(lazy(() => import('@admin/pages/User/Edit')));
const group = settingsGroupNavItems();

const SettingRoutes = () => {
  const { user } = useAuth();

  return {
    path: '/admin/settings',
    element: user ? <MainLayout group={group} /> : <MinimalLayout />,
    children:
      user === undefined
        ? [{ path: '*', element: <Loading /> }]
        : user
        ? [
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
          ]
        : [{ path: '', element: <Navigate to="/admin/auth/login" replace /> }],
  };
};

export default SettingRoutes;
