import React from 'react';
import { HeaderBar } from 'superfast-ui';
import { Props } from './types.js';

export const MainHeader: React.FC<Props> = ({ label, children }) => {
  return (
    <>
      <HeaderBar title={label} />
      {children}
    </>
  );
};
