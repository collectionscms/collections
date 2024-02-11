import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Me } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { api } from '../../../utilities/api.js';

type AuthContext = {
  me: Me | null | undefined;
  getCsrfToken: () => SWRResponse<string, Error>;
  login: () => SWRMutationResponse<void, Error, string, Record<string, any>>;
  logout: () => SWRMutationResponse<void, Error, string, Record<string, any>>;
};

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getCsrfToken = () =>
    useSWR('/auth/csrf', (url) =>
      api.get<{ csrfToken: string }>(url).then((res) => res.data.csrfToken)
    );

  const login = () =>
    useSWRMutation(
      '/auth/callback/credentials',
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<Me>(url, arg).then(() => {
          mutate();
        });
      }
    );

  const logout = () =>
    useSWRMutation('/auth/signout', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post(url, arg).then(() => {
        mutate(null, false);
      });
    });

  // On mount, get me
  const { data: me, mutate } = useSWR('/me', (url) =>
    api
      .get<{ me: Me }>(url)
      .then(({ data }) => {
        return data.me;
      })
      .catch((e) => {
        logger.error(e);
        return null;
      })
  );

  const value = useMemo(
    () => ({
      me,
      getCsrfToken,
      login,
      logout,
    }),
    [me, getCsrfToken, login, logout]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAuth = () => useContext(Context);
