import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { profileNavItems } from '../../../utilities/groupNavItems';
import Loader from '../../elements/Loader';
import Loading from '../../elements/Loading';
import MainLayout from '../../layouts/Main';
import MinimalLayout from '../../layouts/Minimal';
import { useAuth } from '../../utilities/Auth';
import { DocumentInfoProvider } from '../../utilities/DocumentInfo';

const Profile = Loader(lazy(() => import('@admin/pages/Profile')));
const group = profileNavItems();

const ProfileRoutes = () => {
  const { user } = useAuth();

  return {
    path: '/admin',
    element: user ? <MainLayout group={group} /> : <MinimalLayout />,
    children:
      user === undefined
        ? [{ path: '*', element: <Loading /> }]
        : user
        ? [
            { path: '', element: <Navigate to={group.items[0].href} replace /> },
            {
              path: 'me',
              element: (
                <DocumentInfoProvider label="profile">
                  <Profile />
                </DocumentInfoProvider>
              ),
            },
          ]
        : [{ path: '*', element: <Navigate to="/admin/auth/login" replace /> }],
  };
};

export default ProfileRoutes;
