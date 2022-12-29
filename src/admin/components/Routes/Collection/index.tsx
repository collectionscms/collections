import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { useAuth } from '@admin/components/utilities/Auth';
import { useConfig } from '@admin/components/utilities/Config';
import Edit from '@admin/pages/collections/Edit';
import List from '@admin/pages/collections/List';
import { collectionsGroupNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Unauthorized = Loader(lazy(() => import('@admin/pages/Unauthorized')));

const CollectionRoutes = () => {
  const { user } = useAuth();
  const { collections } = useConfig();

  const permissions = user ? user.role.permissions : [];
  const adminAccessEnabled = user ? user.role.adminAccess : false;

  const permittedCollections = collections.filter(
    (collection) =>
      adminAccessEnabled ||
      permissions.some((permission) => permission.collection == collection.collection)
  );

  const group = collectionsGroupNavItems(permittedCollections);

  return {
    path: '/admin/collections',
    element: <MainLayout group={group} />,
    children: [
      {
        path: '',
        element: group.items[0] && <Navigate to={group.items[0].href} replace />,
      },
      ...permittedCollections.flatMap((collection) => [
        {
          path: `${collection.collection}`,
          element: <List collection={collection} />,
        },
        {
          path: `${collection.collection}/create`,
          element: <Edit collection={collection} />,
        },
        {
          path: `${collection.collection}/:id`,
          element: <Edit collection={collection} />,
        },
      ]),
      {
        path: '*',
        element: <Unauthorized />,
      },
    ],
  };
};

export default CollectionRoutes;
