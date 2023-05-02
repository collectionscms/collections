import React from 'react';
import { DefaultListPage } from './Default.js';
import { SingletonPage } from './Singleton.js';
import { Props } from './types.js';

const ListPage: React.FC<Props> = ({ collection }) => {
  return collection.singleton ? (
    <SingletonPage collection={collection} />
  ) : (
    <DefaultListPage collection={collection} />
  );
};

export default ListPage;
