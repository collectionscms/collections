import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { collectionsGroupNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const List = Loader(lazy(() => import('@admin/pages/collections/List')));
const Create = Loader(lazy(() => import('@admin/pages/collections/Create')));
const Edit = Loader(lazy(() => import('@admin/pages/collections/Edit')));
const groups = collectionsGroupNavItems([
  { collection: 'Restaurant' },
  { collection: 'Menu' },
  { collection: 'Owner' },
]);

const CollectionRoutes = {
  path: '/admin/collections',
  element: <MainLayout groups={groups} />,
  children: [
    { path: '', element: <Navigate to={groups[0].items[0].href} replace /> },
    { path: ':collection', element: <List /> },
    { path: ':collection/create', element: <Create /> },
    { path: ':collection/:id', element: <Edit /> },
  ],
};

export default CollectionRoutes;
