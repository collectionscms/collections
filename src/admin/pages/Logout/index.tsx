import React, { useEffect } from 'react';
import { logger } from '../../../utilities/logger.js';
import { Loading } from '../../components/elements/Loading/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { getLoginUrl } from '../../utilities/urlGenerator.js';

export const Logout: React.FC = () => {
  const { getCsrfToken, logout } = useAuth();
  const { data: csrfToken } = getCsrfToken();
  const { trigger } = logout();

  useEffect(() => {
    const logout = async () => {
      try {
        await trigger({
          csrfToken: csrfToken,
        });
      } catch (e) {
        logger.error(e);
      }
    };

    if (csrfToken) {
      logout();
      window.location.href = getLoginUrl();
    }
  }, [csrfToken]);

  return <Loading />;
};
