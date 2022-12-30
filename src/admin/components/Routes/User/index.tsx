import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { DocumentInfoProvider } from '@admin/components/utilities/DocumentInfo';
import { usersGroupNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const User = Loader(lazy(() => import('@admin/pages/User')));
const EditUser = Loader(lazy(() => import('@admin/pages/User/Edit')));
const group = usersGroupNavItems();

const props = (id: string) => {
  const item = group.items.find((group) => group.id == id);
  return { label: item.label, fields: item.fields };
};

const UserRoutes = {
  path: '/admin',
  element: <MainLayout group={group} />,
  children: [
    { path: '', element: <Navigate to={group.items[0].href} replace /> },
    {
      path: 'users',
      element: (
        <DocumentInfoProvider {...props('users')}>
          <User />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'users/create',
      element: (
        <DocumentInfoProvider {...props('users')}>
          <EditUser />
        </DocumentInfoProvider>
      ),
    },
    {
      path: 'users/:id',
      element: (
        <DocumentInfoProvider {...props('users')}>
          <EditUser />
        </DocumentInfoProvider>
      ),
    },
  ],
};

export default UserRoutes;
