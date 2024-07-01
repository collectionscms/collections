import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProfilePage } from '../../../pages/Profile/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { NavContentLayout } from '../../layouts/NavContentLayout/index.js';

export const MeRoutes = () => {
  const { t } = useTranslation();

  return {
    path: '/admin',
    element: <NavContentLayout variable="profile" />,
    children: [
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
