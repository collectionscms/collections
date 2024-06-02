import React from 'react';
import { useTranslation } from 'react-i18next';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { SidebarLayout } from '../../layouts/Sidebar/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

const ReviewDetailPage = Loader(
  lazy(() => import('../../../pages/Review/Detail/index.js'), 'ReviewDetailPage')
);
const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));

export const ReviewRoutes = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();

  const children = [{ path: '*', element: <NotFound /> }];

  if (hasPermission('readOwnReview')) {
    children.push({
      path: ':id',
      element: (
        <MainHeader label={t('review')}>
          <ReviewDetailPage />
        </MainHeader>
      ),
    });
  }

  return {
    path: '/admin/reviews',
    element: <SidebarLayout variable="tenant" />,
    children,
  };
};
