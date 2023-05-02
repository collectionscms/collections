import React from 'react';
import { Navigate } from 'react-router-dom';
import { profileNavItems } from '../../../utilities/groupNavItems.js';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';
import { useAuth } from '../../utilities/Auth/index.js';
import { DocumentInfoProvider } from '../../utilities/DocumentInfo/index.js';

const Profile = Loader(lazy(() => import('../../../pages/Profile/index.js'), 'Profile'));
const group = profileNavItems();

export const RootRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return {
      path: '/admin',
      children: [
        { path: '', element: <Navigate to="/admin/auth/login" replace /> },
        { path: '*', element: <Navigate to="/admin/auth/login" replace /> },
      ],
    };
  }

  return {
    path: '/admin',
    element: <MainLayout group={group} />,
    children: [
      { path: '', element: <Navigate to="/admin/collections" replace /> },
      {
        path: 'me',
        element: (
          <DocumentInfoProvider label="profile">
            <Profile />
          </DocumentInfoProvider>
        ),
      },
    ],
  };
};
