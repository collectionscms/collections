import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loading } from '../../components/elements/Loading/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { AcceptInvitationContextProvider, useInvitation } from './Context/index.js';

const AcceptInvitationImpl: React.FC = () => {
  const { me } = useAuth();
  const navigate = useNavigate();
  const { accept } = useInvitation();
  const { trigger } = accept();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  useEffect(() => {
    if (!me) return;
    if (!email || !token || me.email !== email) {
      enqueueSnackbar(t('error.unauthorized_user'), { variant: 'error' });
      return navigate('/admin');
    }

    const accept = async () => {
      await trigger({
        token: token,
      });

      enqueueSnackbar(t('toast.joined_project'), { variant: 'success' });
    };

    accept();
  }, [me]);

  return <Loading />;
};

export const AcceptInvitation = ComposeWrapper({ context: AcceptInvitationContextProvider })(
  AcceptInvitationImpl
);
