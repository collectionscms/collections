import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { collectionsGroupNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const List = Loader(lazy(() => import('@admin/pages/collections/List')));
const Edit = Loader(lazy(() => import('@admin/pages/collections/Edit')));
const group = collectionsGroupNavItems([
  { collection: 'Restaurant' },
  { collection: 'Menu' },
  { collection: 'Owner' },
]);

const CollectionRoutes = {
  path: '/admin/collections',
  element: <MainLayout group={group} />,
  children: [
    { path: '', element: <Navigate to={group.items[0].href} replace /> },
    { path: ':collection', element: <List /> },
    { path: ':collection/create', element: <Edit /> },
    { path: ':collection/:id', element: <Edit /> },
  ],
};

export default CollectionRoutes;
