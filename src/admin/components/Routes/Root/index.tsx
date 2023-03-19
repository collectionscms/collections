import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { profileNavItems } from '../../../utilities/groupNavItems';
import Loader from '../../elements/Loader';
import MainLayout from '../../layouts/Main';
import { useAuth } from '../../utilities/Auth';
import { DocumentInfoProvider } from '../../utilities/DocumentInfo';

const Profile = Loader(lazy(() => import('../../../pages/Profile')));
const group = profileNavItems();

const RootRoutes = () => {
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

export default RootRoutes;
