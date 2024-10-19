import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

const EditorLayout = Loader(lazy(() => import('../../layouts/Editor/index.js'), 'EditorLayout'));
const EditPost = Loader(lazy(() => import('../../../pages/Post/Edit/index.js'), 'EditPostPage'));
const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));

export const EditPostRoutes = () => {
  const { hasPermission } = useAuth();

  const children = [{ path: '*', element: <NotFound /> }];

  if (hasPermission('savePost')) {
    children.push({
      path: ':id',
      element: <EditPost />,
    });
  }

  return {
    path: '/admin/contents',
    element: <EditorLayout />,
    children,
  };
};
