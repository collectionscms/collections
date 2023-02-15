import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { useAuth } from '@admin/components/utilities/Auth';
import { useConfig } from '@admin/components/utilities/Config';
import Edit from '@admin/pages/collections/Edit';
import List from '@admin/pages/collections/List';
import { collectionsGroupNavItems } from '@admin/utilities/groupNavItems';
import { Collection } from '@shared/types';
import React, { lazy, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Unauthorized = Loader(lazy(() => import('@admin/pages/Unauthorized')));

const CollectionRoutes = () => {
  const [permittedCollections, setPermittedCollections] = useState([]);
  const [group, setGroup] = useState(collectionsGroupNavItems([]));
  const { user } = useAuth();
  const { collections } = useConfig();

  const filteredPermittedCollections = (): Collection[] => {
    if (!user) return [];
    if (user.role.adminAccess) return collections;

    const permissions = user.role.permissions;

    return collections.filter((collection) =>
      permissions.some((permission) => permission.collection === collection.collection)
    );
  };

  useEffect(() => {
    if (collections === undefined) return;
    const permitted = filteredPermittedCollections();
    setPermittedCollections(permitted);
    const group = collectionsGroupNavItems(permitted);
    setGroup(group);
  }, [user, collections]);

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
