import React from 'react';
import { useParams } from 'react-router-dom';
import Default from './Default';
import Singleton from './Singleton';

const List: React.FC = () => {
  const { collection } = useParams();
  const collections = [
    { collection: 'Restaurant', singleton: false },
    { collection: 'Menu', singleton: false },
    { collection: 'Owner', singleton: true },
  ];
  const meta = collections.filter((meta) => meta.collection === collection);

  return meta[0].singleton ? (
    <Singleton collection={collection} />
  ) : (
    <Default collection={collection} />
  );
};

export default List;
