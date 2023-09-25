import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { settingsGroupNavItems } from '../../../utilities/groupNavItems.js';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

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
  const { t } = useTranslation();

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
          <MainHeader label={t('project_setting')}>
            <Project />
          </MainHeader>
        ),
      },

      // /////////////////////////////////////
      // Content Types
      // /////////////////////////////////////
      {
        path: 'content-types',
        element: (
          <MainHeader label={t('content_type')}>
            <ContentType />
          </MainHeader>
        ),
      },
      {
        path: 'content-types/create',
        element: (
          <MainHeader label={t('create.content_type')}>
            <CreateContentType />
          </MainHeader>
        ),
      },
      {
        path: 'content-types/:modelId',
        element: (
          <MainHeader label={t('edit.content_type')}>
            <EditContentType />
          </MainHeader>
        ),
      },

      // /////////////////////////////////////
      // Roles
      // /////////////////////////////////////
      {
        path: 'roles',
        element: (
          <MainHeader label={t('role')}>
            <Role />
          </MainHeader>
        ),
      },
      {
        path: 'roles/create',
        element: (
          <MainHeader label={t('create.role')}>
            <CreateRole />
          </MainHeader>
        ),
      },
      {
        path: 'roles/:id',
        element: (
          <MainHeader label={t('edit.role')}>
            <EditRole />
          </MainHeader>
        ),
      },

      // /////////////////////////////////////
      // Users
      // /////////////////////////////////////
      {
        path: 'users',
        element: (
          <MainHeader label={t('user')}>
            <User />
          </MainHeader>
        ),
      },
      {
        path: 'users/create',
        element: (
          <MainHeader label={t('create.user')}>
            <CreateUser />
          </MainHeader>
        ),
      },
      {
        path: 'users/:id',
        element: (
          <MainHeader label={t('edit.user')}>
            <EditUser />
          </MainHeader>
        ),
      },
    ],
  };
};
