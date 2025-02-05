import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { ProjectSettingsTab } from '../../elements/ProjectSettingsTab/index.js';
import { NavContentLayout } from '../../layouts/NavContentLayout/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

// Project
const Project = Loader(lazy(() => import('../../../pages/Project/index.js'), 'Project'));
const EditSeo = Loader(lazy(() => import('../../../pages/Project/Seo/index.js'), 'EditSeoPage'));

// Role
const Role = Loader(lazy(() => import('../../../pages/Role/index.js'), 'RolePage'));
const CreateRole = Loader(
  lazy(() => import('../../../pages/Role/Create/index.js'), 'CreateRolePage')
);
const EditRole = Loader(lazy(() => import('../../../pages/Role/Edit/index.js'), 'EditRolePage'));

// User
const User = Loader(lazy(() => import('../../../pages/User/index.js'), 'UserPage'));
const CreateUser = Loader(
  lazy(() => import('../../../pages/User/Create/index.js'), 'CreateUserPage')
);
const EditUser = Loader(lazy(() => import('../../../pages/User/Edit/index.js'), 'EditUserPage'));

// Api key
const ApiKey = Loader(lazy(() => import('../../../pages/ApiKey/index.js'), 'ApiKeyPage'));
const CreateApiKey = Loader(
  lazy(() => import('../../../pages/ApiKey/Create/index.js'), 'CreateApiKeyPage')
);
const EditApiKey = Loader(
  lazy(() => import('../../../pages/ApiKey/Edit/index.js'), 'EditApiKeyPage')
);

// Webhook
const WebhookSetting = Loader(
  lazy(() => import('../../../pages/WebhookSetting/index.js'), 'WebhookSettingPage')
);
const CreateWebhookSetting = Loader(
  lazy(() => import('../../../pages/WebhookSetting/Create/index.js'), 'CreateWebhookSettingPage')
);
const EditWebhookSetting = Loader(
  lazy(() => import('../../../pages/WebhookSetting/Edit/index.js'), 'EditWebhookSettingPage')
);

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
      element: <Navigate to="general" replace />,
    });

    children.push({
      path: 'project/general',
      element: (
        <MainHeader label={t('project_setting')}>
          <ProjectSettingsTab>
            <Project />
          </ProjectSettingsTab>
        </MainHeader>
      ),
    });

    children.push({
      path: 'project/seo',
      element: (
        <MainHeader label={t('project_setting')}>
          <ProjectSettingsTab>
            <EditSeo />
          </ProjectSettingsTab>
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

  if (hasPermission('inviteUser')) {
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

  // /////////////////////////////////////
  // Api keys
  // /////////////////////////////////////

  if (hasPermission('readApiKey')) {
    children.push({
      path: 'api-keys',
      element: (
        <MainHeader label={t('api_key')}>
          <ApiKey />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('createApiKey')) {
    children.push({
      path: 'api-keys/create',
      element: (
        <MainHeader label={t('create.api_key')}>
          <CreateApiKey />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('updateApiKey')) {
    children.push({
      path: 'api-keys/:id',
      element: (
        <MainHeader label={t('edit.api_key')}>
          <EditApiKey />
        </MainHeader>
      ),
    });
  }

  // /////////////////////////////////////
  // Webhooks
  // /////////////////////////////////////

  if (hasPermission('readWebhookSetting')) {
    children.push({
      path: 'webhooks',
      element: (
        <MainHeader label={t('webhook')}>
          <WebhookSetting />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('createWebhookSetting')) {
    children.push({
      path: 'webhooks/create',
      element: (
        <MainHeader label={t('create.webhook')}>
          <CreateWebhookSetting />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('updateWebhookSetting')) {
    children.push({
      path: 'webhooks/:id',
      element: (
        <MainHeader label={t('edit.webhook')}>
          <EditWebhookSetting />
        </MainHeader>
      ),
    });
  }

  return {
    path: '/admin/settings',
    element: <NavContentLayout variable="tenant" />,
    children,
  };
};
