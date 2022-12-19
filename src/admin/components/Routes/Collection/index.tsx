import Loader from '@admin/components/elements/Loader';
import CollectionLayout from '@admin/components/layouts/Collection';
import React, { lazy } from 'react';

const List = Loader(lazy(() => import('@admin/pages/collections/List')));
const Create = Loader(lazy(() => import('@admin/pages/collections/Create')));
const Edit = Loader(lazy(() => import('@admin/pages/collections/Edit')));

const CollectionRoutes = {
  path: '/admin/collections',
  element: <CollectionLayout />,
  children: [
    { path: ':collection', element: <List /> },
    { path: ':collection/create', element: <Create /> },
    { path: ':collection/:id', element: <Edit /> },
  ],
};

export default CollectionRoutes;
