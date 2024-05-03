import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';

const ProfilePage = Loader(lazy(() => import('../../../pages/Profile/index.js'), 'ProfilePage'));
const PostPage = Loader(lazy(() => import('../../../pages/Post/index.js'), 'PostPage'));

export const TenantRootRoutes = () => {
  const { t } = useTranslation();

  return {
    path: '/admin',
    element: <MainLayout showNavContent={true} />,
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
