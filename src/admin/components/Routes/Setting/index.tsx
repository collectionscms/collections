import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { SidebarLayout } from '../../layouts/Sidebar/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

const Project = Loader(lazy(() => import('../../../pages/Project/index.js'), 'Project'));
const Role = Loader(lazy(() => import('../../../pages/Role/index.js'), 'RolePage'));
const CreateRole = Loader(
  lazy(() => import('../../../pages/Role/Create/index.js'), 'CreateRolePage')
);
const EditRole = Loader(lazy(() => import('../../../pages/Role/Edit/index.js'), 'EditRolePage'));
const User = Loader(lazy(() => import('../../../pages/User/index.js'), 'UserPage'));
const CreateUser = Loader(
  lazy(() => import('../../../pages/User/Create/index.js'), 'CreateUserPage')
);
const EditUser = Loader(lazy(() => import('../../../pages/User/Edit/index.js'), 'EditUserPage'));
const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));

export const SettingRoutes = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  const children = [
    { path: '', element: <Navigate to="/admin" replace /> },
    { path: '*', element: <NotFound /> },
  ];

  // /////////////////////////////////////
  // Project
  // /////////////////////////////////////

  if (hasPermission('readProject')) {
    children.push({
      path: 'project',
      element: (
        <MainHeader label={t('project_setting')}>
          <Project />
        </MainHeader>
      ),
    });
  }

  // /////////////////////////////////////
  // Roles
  // /////////////////////////////////////

  if (hasPermission('readRole')) {
    children.push({
      path: 'roles',
      element: (
        <MainHeader label={t('role')}>
          <Role />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('createRole')) {
    children.push({
      path: 'roles/create',
      element: (
        <MainHeader label={t('create.role')}>
          <CreateRole />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('updateRole')) {
    children.push({
      path: 'roles/:id',
      element: (
        <MainHeader label={t('edit.role')}>
          <EditRole />
        </MainHeader>
      ),
    });
  }

  // /////////////////////////////////////
  // Users
  // /////////////////////////////////////

  if (hasPermission('readUser')) {
    children.push({
      path: 'users',
      element: (
        <MainHeader label={t('user')}>
          <User />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('createUser')) {
    children.push({
      path: 'users/create',
      element: (
        <MainHeader label={t('create.user')}>
          <CreateUser />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('updateUser')) {
    children.push({
      path: 'users/:id',
      element: (
        <MainHeader label={t('edit.user')}>
          <EditUser />
        </MainHeader>
      ),
    });
  }

  return {
    path: '/admin/settings',
    element: <SidebarLayout variable="tenant" />,
    children,
  };
};
