import React from 'react';
import { Props } from './types';

const List: React.FC<Props> = ({ collection }) => {
  return <p>{collection}</p>;
};

export default List;
