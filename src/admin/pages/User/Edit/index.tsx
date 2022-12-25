import React from 'react';
import { useParams } from 'react-router-dom';

const EditPage: React.FC = () => {
  const { id } = useParams();

  return <>{id ? 'Edit' : 'Create'} User</>;
};

export default EditPage;
