import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Collection } from '../../../../shared/types';
import Edit from '../../../pages/collections/Edit';
import List from '../../../pages/collections/List';
import { collectionsGroupNavItems } from '../../../utilities/groupNavItems';
import Loading from '../../elements/Loading';
import MainLayout from '../../layouts/Main';
import MinimalLayout from '../../layouts/Minimal';
import { useAuth } from '../../utilities/Auth';
import { useConfig } from '../../utilities/Config';

const CollectionRoutes = () => {
  const [permittedCollections, setPermittedCollections] = useState([]);
  const [group, setGroup] = useState(collectionsGroupNavItems([]));
  const { user, permissions } = useAuth();
  const { collections } = useConfig();

  const filteredPermittedCollections = (): Collection[] => {
    if (!user) return [];
    if (user.adminAccess) return collections;

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
  }, [permissions, collections]);

  return {
    path: '/admin/collections',
    element: user ? <MainLayout group={group} /> : <MinimalLayout />,
    children:
      user === undefined
        ? [{ path: '*', element: <Loading /> }]
        : user
        ? [
            {
              path: '',
              element: group.items[0] && <Navigate to={group.items[0].href} replace />,
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
              element: <></>,
            },
          ]
        : [{ path: '', element: <Navigate to="/admin/auth/login" replace /> }],
  };
};

export default CollectionRoutes;
