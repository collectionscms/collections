import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { modelsGroupNavItems } from '../../../utilities/groupNavItems.js';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { useConfig } from '../../utilities/Config/index.js';

const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));
const ModelNotFound = Loader(
  lazy(() => import('../../../pages/ModelNotFound/index.js'), 'ModelNotFound')
);
const CreateFirstModel = Loader(
  lazy(() => import('./CreateFirstModel/index.js'), 'CreateFirstModel')
);
const List = Loader(lazy(() => import('../../../pages/models/List/index.js'), 'ListPage'));
const Singleton = Loader(
  lazy(() => import('../../../pages/models/List/Singleton.js'), 'SingletonPage')
);
const CreateModel = Loader(
  lazy(() => import('../../../pages/models/Create/index.js'), 'CreateModelPage')
);
const EditModel = Loader(
  lazy(() => import('../../../pages/models/Edit/index.js'), 'EditModelPage')
);

export const ModelRoutes = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { permittedModels } = useConfig();

  const { group } = useMemo(() => {
    const group = modelsGroupNavItems(permittedModels || []);
    return { permittedModels, group };
  }, [permittedModels]);

  if (!user) {
    return {
      path: '/admin/models',
      children: [
        { path: '', element: <Navigate to="/admin/auth/login" replace /> },
        { path: '*', element: <Navigate to="/admin/auth/login" replace /> },
      ],
    };
  }

  const emptyPage = user.admin_access ? <CreateFirstModel /> : <ModelNotFound />;

  return {
    path: '/admin/models',
    element: <MainLayout group={group} />,
    children: [
      {
        path: '',
        element: group.items[0] ? <Navigate to={group.items[0].href} replace /> : emptyPage,
      },
      ...permittedModels.flatMap((model) => [
        model.singleton
          ? {
              path: `${model.id}/contents`,
              element: (
                <MainHeader label={model.model}>
                  <Singleton />
                </MainHeader>
              ),
            }
          : {
              path: `${model.id}/contents`,
              element: (
                <MainHeader label={model.model}>
                  <List />
                </MainHeader>
              ),
            },
        {
          path: `${model.id}/contents/create`,
          element: (
            <MainHeader label={t('create.custom', { page: model.model })}>
              <CreateModel />
            </MainHeader>
          ),
        },
        {
          path: `${model.id}/contents/:id`,
          element: (
            <MainHeader label={t('edit.custom', { page: model.model })}>
              <EditModel />
            </MainHeader>
          ),
        },
      ]),
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  };
};
