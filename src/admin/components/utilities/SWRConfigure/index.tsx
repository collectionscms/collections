import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SWRConfig } from 'swr';
import { ApiError } from '../../../../shared/types';
import { Props } from './types';

const SWRConfigure: React.FC<Props> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return (
    <SWRConfig
      value={{
        onError: (err) => {
          if (err instanceof AxiosError) {
            const apiError = err.response.data as ApiError;
            if (apiError) {
              let message = `${t(`error.${apiError.code}` as unknown as TemplateStringsArray)}`;
              if (apiError.stack) message += `(${apiError.stack.join(', ')})`;
              enqueueSnackbar(message, { variant: 'error' });
            } else {
              enqueueSnackbar(t('error.internal_server_error'), { variant: 'error' });
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
