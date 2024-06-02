import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { SidebarLayout } from '../../layouts/Sidebar/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

const PostPage = Loader(lazy(() => import('../../../pages/Post/index.js'), 'PostPage'));
const ReviewPage = Loader(lazy(() => import('../../../pages/Review/index.js'), 'ReviewPage'));

export const TenantRootRoutes = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  const children = [{ path: '', element: <Navigate to="/admin/posts" replace /> }];

  if (hasPermission('readPost')) {
    children.push({
      path: 'posts',
      element: (
        <MainHeader label={t('posts')}>
          <PostPage />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('readOwnReview')) {
    children.push({
      path: 'reviews',
      element: (
        <MainHeader label={t('review')}>
          <ReviewPage />
        </MainHeader>
      ),
    });
  }

  return {
    path: '/admin',
    element: <SidebarLayout variable="tenant" />,
    children,
  };
};
