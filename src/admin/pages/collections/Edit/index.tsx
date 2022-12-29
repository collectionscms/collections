import React from 'react';
import { useParams } from 'react-router-dom';
import { Props } from './types';

const EditPage: React.FC<Props> = ({ collection }) => {
  const { id } = useParams();

  return (
    <>
      {id ? 'Edit' : 'Create'} {collection.collection}
    </>
  );
};

export default EditPage;
