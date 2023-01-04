import Loader from '@admin/components/elements/Loader';
import MainLayout from '@admin/components/layouts/Main';
import { profileNavItems } from '@admin/utilities/groupNavItems';
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Profile = Loader(lazy(() => import('@admin/pages/Profile')));
const group = profileNavItems();

const ProfileRoutes = {
  path: '/admin',
  element: <MainLayout group={group} />,
  children: [
    { path: '', element: <Navigate to={group.items[0].href} replace /> },
    {
      path: 'me',
      element: <Profile />,
    },
  ],
};

export default ProfileRoutes;
