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
const PostPage = Loader(lazy(() => import('../../../pages/Post/index.js'), 'PostPage'));
const group = profileNavItems();

export const RootRoutes = () => {
  const { me } = useAuth();
  const { t } = useTranslation();

  if (!me) {
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
      { path: '', element: <Navigate to="/admin/posts" replace /> },
      {
        path: 'me',
        element: (
          <MainHeader label={t('profile')}>
            <ProfilePage />
          </MainHeader>
        ),
      },
      {
        path: 'posts',
        element: (
          <MainHeader label={t('posts')}>
            <PostPage />
          </MainHeader>
        ),
      },
    ],
  };
};
