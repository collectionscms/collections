import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { EditorLayout } from '../../layouts/Editor/index.js';

const EditPost = Loader(lazy(() => import('../../../pages/Post/Edit/index.js'), 'EditPostPage'));

export const PostRoutes = () => {
  return {
    path: '/admin/posts/:id',
    element: <EditorLayout />,
    children: [
      {
        path: '',
        element: <EditPost />,
      },
    ],
  };
};
