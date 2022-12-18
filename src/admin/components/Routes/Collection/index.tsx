import Loader from '@admin/components/elements/Loader';
import CollectionLayout from '@admin/components/layouts/Collection';
import React, { lazy } from 'react';

const List = lazy(() => import('@admin/pages/collections/List'));

const buildWrapElement = (props: { type: string }) => {
  const WrapElement = Loader(List, props);
  return <WrapElement />;
};

// TODO Retrieve from DB
const collections = [{ type: 'Restaurant' }, { type: 'Menu' }];

const AppRoutes = {
  path: '/admin/collections',
  element: <CollectionLayout />,
  children: [
    ...collections.map((collection) => ({
      path: `${collection.type}`,
      element: <>{buildWrapElement({ ...collection })}</>,
    })),
  ],
};

export default AppRoutes;
