import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loading } from '../../components/elements/Loading/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { getUrlForTenant } from '../../utilities/urlGenerator.js';
import { AcceptInvitationContextProvider, useInvitation } from './Context/index.js';

const AcceptInvitationImpl: React.FC = () => {
  const { t } = useTranslation();
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
      enqueueSnackbar(t('error.unauthorized_user'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      return navigate('/admin');
    }

    const accept = async () => {
      const project = await trigger({
        token: token,
      });

      window.location.href = getUrlForTenant(project.subdomain, '/admin');
    };

    accept();
  }, [me]);

  return <Loading />;
};

export const AcceptInvitation = ComposeWrapper({ context: AcceptInvitationContextProvider })(
  AcceptInvitationImpl
);
