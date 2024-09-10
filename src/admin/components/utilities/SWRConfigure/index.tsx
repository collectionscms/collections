import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SWRConfig } from 'swr';
import { ApiError } from '../../../../types/index.js';
import { Props } from './types.js';

export const SWRConfigure: React.FC<Props> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  return (
    <SWRConfig
      value={{
        onError: (e) => {
          if (e instanceof AxiosError) {
            const apiError = e.response?.data as ApiError;
            if (!apiError?.code) {
              return enqueueSnackbar(t('error.internal_server_error'), {
                variant: 'error',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'center',
                },
              });
            }

            // Refresh the token,  No snack bar display.
            if (apiError.code === 'token_expired') return;

            let message = `${t(`error.${apiError.code}` as unknown as TemplateStringsArray)}`;
            if (apiError.extensions?.message) {
              message += `(${apiError.extensions.message})`;
            }
            enqueueSnackbar(message, {
              variant: 'error',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            });
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
