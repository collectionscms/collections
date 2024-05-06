import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProfilePage } from '../../../pages/Profile/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { SidebarLayout } from '../../layouts/Sidebar/index.js';

export const MeRoutes = () => {
  const { t } = useTranslation();

  return {
    path: '/admin',
    element: <SidebarLayout variable="profile" />,
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
