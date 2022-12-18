import Loader from '@admin/components/elements/Loader';
import CollectionLayout from '@admin/components/layouts/Collection';
import React, { lazy } from 'react';

const List = Loader(lazy(() => import('@admin/pages/collections/List')));

const AppRoutes = {
  path: '/admin/collections',
  element: <CollectionLayout />,
  children: [{ path: ':collection', element: <List /> }],
};

export default AppRoutes;
