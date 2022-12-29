import React from 'react';
import Default from './Default';
import Singleton from './Singleton';
import { Props } from './types';

const ListPage: React.FC<Props> = ({ collection }) => {
  return collection.singleton ? (
    <Singleton collection={collection} />
  ) : (
    <Default collection={collection} />
  );
};

export default ListPage;
