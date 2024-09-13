import React from 'react';
import { HeaderBar } from '../../../@extended/components/HeaderBar/index.js';

export type Props = {
  label: string;
  children?: React.ReactNode;
};

export const MainHeader: React.FC<Props> = ({ label, children }) => {
  return (
    <>
      <HeaderBar title={label} />
      {children}
    </>
  );
};
