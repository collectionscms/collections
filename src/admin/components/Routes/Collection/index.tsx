import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Collection } from '../../../../config/types.js';
import { EditCollectionPage as Edit } from '../../../pages/collections/Edit/index.js';
import List from '../../../pages/collections/List/index.js';
import { collectionsGroupNavItems } from '../../../utilities/groupNavItems.js';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
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

export const CollectionRoutes = () => {
  const { user, permissions } = useAuth();
  const { collections } = useConfig();

  const filteredPermittedCollections = (): Collection[] => {
    if (!user) return [];
    if (user.adminAccess) return collections;

    return collections.filter((collection) =>
      permissions?.some((permission) => permission.collection === collection.collection)
    );
  };

  const { permittedCollections, group } = useMemo(() => {
    const permittedCollections = filteredPermittedCollections();
    const group = collectionsGroupNavItems(permittedCollections);
    return { permittedCollections, group };
  }, [permissions, collections]);

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
        {
          path: `${collection.collection}`,
          element: <List key={collection.collection} collection={collection} />,
        },
        {
          path: `${collection.collection}/create`,
          element: <Edit key={collection.collection} collection={collection} />,
        },
        {
          path: `${collection.collection}/:id`,
          element: <Edit key={collection.collection} collection={collection} />,
        },
      ]),
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  };
};
