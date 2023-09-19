import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { collectionsGroupNavItems } from '../../../utilities/groupNavItems.js';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { useConfig } from '../../utilities/Config/index.js';

const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));
const CollectionNotFound = Loader(
  lazy(() => import('../../../pages/CollectionNotFound/index.js'), 'CollectionNotFound')
);
const CreateFirstCollection = Loader(
  lazy(() => import('./CreateFirstCollection/index.js'), 'CreateFirstCollection')
);
const List = Loader(lazy(() => import('../../../pages/collections/List/index.js'), 'ListPage'));
const Singleton = Loader(
  lazy(() => import('../../../pages/collections/List/Singleton.js'), 'SingletonPage')
);
const CreateCollection = Loader(
  lazy(() => import('../../../pages/collections/Create/index.js'), 'CreateCollectionPage')
);
const EditCollection = Loader(
  lazy(() => import('../../../pages/collections/Edit/index.js'), 'EditCollectionPage')
);

export const CollectionRoutes = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { permittedCollections } = useConfig();

  const { group } = useMemo(() => {
    const group = collectionsGroupNavItems(permittedCollections || []);
    return { permittedCollections, group };
  }, [permittedCollections]);

  if (!user) {
    return {
      path: '/admin/collections',
      children: [
        { path: '', element: <Navigate to="/admin/auth/login" replace /> },
        { path: '*', element: <Navigate to="/admin/auth/login" replace /> },
      ],
    };
  }

  const emptyPage = user.adminAccess ? <CreateFirstCollection /> : <CollectionNotFound />;

  return {
    path: '/admin/collections',
    element: <MainLayout group={group} />,
    children: [
      {
        path: '',
        element: group.items[0] ? <Navigate to={group.items[0].href} replace /> : emptyPage,
      },
      ...permittedCollections.flatMap((collection) => [
        collection.singleton
          ? {
              path: `${collection.id}`,
              element: (
                <MainHeader label={collection.collection}>
                  <Singleton />
                </MainHeader>
              ),
            }
          : {
              path: `${collection.id}`,
              element: (
                <MainHeader label={collection.collection}>
                  <List />
                </MainHeader>
              ),
            },
        {
          path: `${collection.id}/create`,
          element: (
            <MainHeader label={t('create.custom', { page: collection.collection })}>
              <CreateCollection />
            </MainHeader>
          ),
        },
        {
          path: `${collection.id}/contents/:id`,
          element: (
            <MainHeader label={t('edit.custom', { page: collection.collection })}>
              <EditCollection />
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
