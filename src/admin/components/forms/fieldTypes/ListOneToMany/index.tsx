import React from 'react';
import { ContentContextProvider } from '../../../../pages/collections/Context/index.js';
import { ComposeWrapper } from '../../../utilities/ComposeWrapper/index.js';
import { Props } from '../types.js';

export const ListOneToManyTypeImpl: React.FC<Props> = ({}) => {
  return <></>;
};

export const ListOneToManyType = ComposeWrapper({ context: ContentContextProvider })(
  ListOneToManyTypeImpl
);
