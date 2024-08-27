import React from 'react';
import { useTranslation } from 'react-i18next';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';

const ActivityBarLayout = Loader(
  lazy(() => import('../../layouts/ActivityBarLayout/index.js'), 'ActivityBarLayout')
);
const CreateProjectPage = Loader(
  lazy(() => import('../../../pages/Project/Create/index.js'), 'CreateProjectPage')
);

export const ProjectRoutes = () => {
  const { t } = useTranslation();

  return {
    path: '/admin/projects',
    element: <ActivityBarLayout />,
    children: [
      {
        path: 'create',
        element: (
          <MainHeader label={t('create.project')}>
            <CreateProjectPage />
          </MainHeader>
        ),
      },
    ],
  };
};
