import React from 'react';
import { useTranslation } from 'react-i18next';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { NavContentLayout } from '../../layouts/NavContentLayout/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));
const ReviewDetailPage = Loader(
  lazy(() => import('../../../pages/Review/Detail/index.js'), 'ReviewDetailPage')
);
const PostPage = Loader(lazy(() => import('../../../pages/Post/index.js'), 'PostPage'));
const ReviewPage = Loader(lazy(() => import('../../../pages/Review/index.js'), 'ReviewPage'));
const TrashPage = Loader(lazy(() => import('../../../pages/Trash/index.js'), 'TrashPage'));

export const PostRoutes = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();

  const children = [{ path: '*', element: <NotFound /> }];

  // /////////////////////////////////////
  // Post
  // /////////////////////////////////////

  if (hasPermission('readOwnPost') || hasPermission('readAllPost')) {
    children.push({
      path: 'posts',
      element: (
        <MainHeader label={t('posts')}>
          <PostPage />
        </MainHeader>
      ),
    });
  }

  // /////////////////////////////////////
  // Review
  // /////////////////////////////////////

  if (hasPermission('readOwnReview') || hasPermission('readAllReview')) {
    children.push({
      path: 'reviews',
      element: (
        <MainHeader label={t('review')}>
          <ReviewPage />
        </MainHeader>
      ),
    });
  }

  if (hasPermission('readOwnReview') || hasPermission('readAllReview')) {
    children.push({
      path: 'reviews/:id',
      element: (
        <MainHeader label={t('review')}>
          <ReviewDetailPage />
        </MainHeader>
      ),
    });
  }

  // /////////////////////////////////////
  // Trash
  // /////////////////////////////////////

  if (hasPermission('trashPost')) {
    children.push({
      path: 'trashed',
      element: (
        <MainHeader label={t('trash')}>
          <TrashPage />
        </MainHeader>
      ),
    });
  }

  return {
    path: '/admin',
    element: <NavContentLayout variable="tenant" />,
    children,
  };
};
