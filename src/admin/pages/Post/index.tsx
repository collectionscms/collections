import React from 'react';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';

export const PostPage: React.FC = () => {
  return (
    <MainCard content={false} title={<></>} secondary={<CreateNewButton to="create" />}></MainCard>
  );
};
