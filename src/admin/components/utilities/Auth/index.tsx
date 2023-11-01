import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { logger } from '../../../../utilities/logger.js';
import { AuthUser, Me, Permission, PermissionsAction } from '../../../config/types.js';
import { api, removeAuthorization, setAuthorization } from '../../../utilities/api.js';
import { AuthContext } from './types.js';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokenInMemory, setTokenInMemory] = useState<string>();
  const [apiKey, setApiKey] = useState<string | null>();

  const login = () =>
    useSWRMutation(
      `/authentications/login`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ token: string; user: AuthUser }>(url, arg).then((res) => {
          setAuthorization(res.data.token);
          setTokenInMemory(res.data.token);
          mutate({ ...res.data, email: '', apiKey: null });
          return res.data;
        });
      }
    );

  const logout = () =>
    useSWRMutation(`/authentications/logout`, async (url: string) => {
      return api.post(url).then((res) => {
        removeAuthorization();
        mutate({ user: null, apiKey: null, email: '', token: '' }, false);
        setTokenInMemory(undefined);
        return res;
      });
    });

  // On mount, get user
  const { data: me, mutate } = useSWR('/me', (url) =>
    api
      .get<Me>(url)
      .then(({ data }) => {
        if (data.token) {
          setAuthorization(data.token);
          setTokenInMemory(data.token);
          setApiKey(data.apiKey);
        }
        return data;
      })
      .catch((e) => {
        logger.error(e);
        if (e.response?.status !== 401) {
          removeAuthorization();
          mutate({ user: null, apiKey: null, email: '', token: '' }, false);
        }
        return null;
      })
  );

  const { data: permissions } = useSWR(
    me?.user ? `/roles/${me.user.roleId}/permissions` : null,
    (url) =>
      api
        .get<{ permissions: Permission[] }>(url)
        .then((res) => res.data.permissions)
        .catch((e) => {
          logger.error(e);
          return null;
        }),
    { suspense: true }
  );

  const hasPermission = useCallback(
    (modelId: string, action: PermissionsAction) => {
      if (!me?.user || !permissions) return false;

      return (
        me.user.adminAccess ||
        permissions.some(
          (permission) => permission.modelId.toString() === modelId && permission.action === action
        )
      );
    },
    [me]
  );

  const updateApiKey = (key: string) => {
    setApiKey(key);
  };

  const value = useMemo(
    () => ({
      user: me?.user,
      permissions,
      hasPermission,
      login,
      logout,
      token: tokenInMemory,
      apiKey,
      updateApiKey,
    }),
    [me, permissions, hasPermission, login, logout]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

type UseAuth<T = AuthUser> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
