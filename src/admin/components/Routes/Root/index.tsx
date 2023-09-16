import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { profileNavItems } from '../../../utilities/groupNavItems.js';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

const ProfilePage = Loader(lazy(() => import('../../../pages/Profile/index.js'), 'ProfilePage'));
const group = profileNavItems();

export const RootRoutes = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

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
          <MainHeader label={t('profile')}>
            <ProfilePage />
          </MainHeader>
        ),
      },
    ],
  };
};
