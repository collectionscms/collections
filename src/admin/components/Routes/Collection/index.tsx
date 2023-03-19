import React, { lazy, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Collection } from '../../../../shared/types';
import Edit from '../../../pages/collections/Edit';
import List from '../../../pages/collections/List';
import { collectionsGroupNavItems } from '../../../utilities/groupNavItems';
import Loader from '../../elements/Loader';
import MainLayout from '../../layouts/Main';
import { useAuth } from '../../utilities/Auth';
import { useConfig } from '../../utilities/Config';

const NotFound = Loader(lazy(() => import('../../../pages/NotFound')));
const CollectionNotFound = Loader(lazy(() => import('./NotFound')));
const CreateFirstCollection = Loader(lazy(() => import('./CreateFirstCollection')));

const CollectionRoutes = () => {
  const { user, permissions } = useAuth();
  const { collections } = useConfig();

  const filteredPermittedCollections = (): Collection[] => {
    if (!user) return [];
    if (user.adminAccess) return collections;

    return collections.filter((collection) =>
      permissions.some((permission) => permission.collection === collection.collection)
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

  const showEmptyPage = () => {
    if (user.adminAccess) {
      <CreateFirstCollection />;
    } else {
      <CollectionNotFound />;
    }
  };

  return {
    path: '/admin/collections',
    element: <MainLayout group={group} />,
    children: [
      {
        path: '',
        element: group.items[0] ? <Navigate to={group.items[0].href} replace /> : showEmptyPage(),
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

export default CollectionRoutes;
