import React, { useEffect } from 'react';
import { logger } from '../../../utilities/logger.js';
import { Loading } from '../../components/elements/Loading/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { VerifyContextProvider, useVerify } from './Context/index.js';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

export const VerifyImpl: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { verify } = useVerify();
  const { trigger } = verify();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    const verify = async () => {
      try {
        await trigger({
          token,
        });
        enqueueSnackbar(t('email_verified'), {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } catch (e) {
        logger.error(e);
      } finally {
        navigate('/admin/auth/login');
      }
    };

    verify();
  }, []);

  return <Loading />;
};

export const Verify = ComposeWrapper({ context: VerifyContextProvider })(VerifyImpl);
