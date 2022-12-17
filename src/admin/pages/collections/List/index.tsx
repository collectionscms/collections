import React from 'react';
import { Props } from './types';

const List: React.FC<Props> = ({ type }) => {
  return <p>{type}</p>;
};

export default List;
