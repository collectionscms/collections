import React from 'react';
import { LocalizedPost } from '../../../../../../types/index.js';

export type Props = {
  post: LocalizedPost;
};

export const Settings: React.FC<Props> = ({ post }) => {
  return <>{post.title}</>;
};
