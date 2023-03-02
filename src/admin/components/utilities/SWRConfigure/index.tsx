import { useSnackbar } from 'notistack';
import React from 'react';
import { SWRConfig } from 'swr';
import { Props } from './types';

const SWRConfigure: React.FC<Props> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <SWRConfig
      value={{
        onError: (err) => {
          if (err.message) {
            enqueueSnackbar(err.message, { variant: 'error' });
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigure;
