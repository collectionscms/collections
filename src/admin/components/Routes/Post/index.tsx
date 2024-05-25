import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { EditorLayout } from '../../layouts/Editor/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

const EditPost = Loader(lazy(() => import('../../../pages/Post/Edit/index.js'), 'EditPostPage'));
const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));

export const PostRoutes = () => {
  const { hasPermission } = useAuth();

  const children = [{ path: '*', element: <NotFound /> }];

  if (hasPermission('updatePost')) {
    children.push({
      path: ':id',
      element: <EditPost />,
    });
  }

  return {
    path: '/admin/posts',
    element: <EditorLayout />,
    children,
  };
};
