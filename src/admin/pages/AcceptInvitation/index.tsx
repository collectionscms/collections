import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '../../../utilities/logger.js';
import { Loading } from '../../components/elements/Loading/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { getUrlForTenant } from '../../utilities/urlGenerator.js';
import { AcceptInvitationContextProvider, useInvitation } from './Context/index.js';

const AcceptInvitationImpl: React.FC = () => {
  const { me } = useAuth();
  const { accept } = useInvitation();
  const { trigger } = accept();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const inviteToken = queryParams.get('inviteToken');

  useEffect(() => {
    if (!me) return;

    const accept = async () => {
      try {
        const project = await trigger({
          inviteToken,
        });
        window.location.href = getUrlForTenant(project.subdomain, '/admin');
      } catch (error) {
        logger.error(error);
      }
    };

    accept();
  }, [me]);

  return !me ? <Loading /> : <></>;
};

export const AcceptInvitation = ComposeWrapper({ context: AcceptInvitationContextProvider })(
  AcceptInvitationImpl
);
