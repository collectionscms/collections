import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SWRConfig } from 'swr';
import { Props } from './types';

const SWRConfigure: React.FC<Props> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return (
    <SWRConfig
      value={{
        onError: (err) => {
          if (err instanceof AxiosError) {
            const data = err.response.data;
            if (data?.code) {
              enqueueSnackbar(t(`error.${data.code}` as unknown as TemplateStringsArray), {
                variant: 'error',
              });
            }
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigure;
