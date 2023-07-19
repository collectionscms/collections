import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../../config/types.js';
import { logger } from '../../../../utilities/logger.js';
import { api, attachRetry, removeAuthorization, setAuthorization } from '../../../utilities/api.js';
import { AuthContext } from './types.js';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokenInMemory, setTokenInMemory] = useState<string>();
  const navigate = useNavigate();

  const login = () =>
    useSWRMutation(
      `/authentications/login`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ token: string; user: AuthUser }>(url, arg).then((res) => {
          setAuthorization(res.data.token);
          setTokenInMemory(res.data.token);
          mutate(res.data);
          return res.data;
        });
      }
    );

  const logout = () =>
    useSWRMutation(`/authentications/logout`, async (url: string) => {
      return api.post(url).then((res) => {
        removeAuthorization();
        mutate({ token: null, user: null }, false);
        setTokenInMemory(undefined);
        return res;
      });
    });

  const refresh = () =>
    useSWRMutation(`/authentications/refresh`, async (url: string) => {
      return api.post<{ token: string }>(url).then((res) => {
        return res.data.token;
      });
    });

  const { trigger: refreshTrigger } = refresh();

  // Refresh tokens when 401 is responded by api.
  attachRetry(
    async (): Promise<string | null> => {
      try {
        const token = await refreshTrigger();
        return token || null;
      } catch (e) {
        logger.error(e);
        return null;
      }
    },
    () => {
      navigate('/admin/auth/logout-inactivity');
    }
  );

  // On mount, get user
  const { data: me, mutate } = useSWR('/me', (url) =>
    api
      .get<{
        token: string | null;
        user: AuthUser | null;
      }>(url)
      .then(({ data }) => {
        if (data.token) {
          setAuthorization(data.token);
          setTokenInMemory(data.token);
        }
        return data;
      })
      .catch((e) => {
        logger.error(e);
        if (e.response?.status !== 401) {
          removeAuthorization();
          mutate({ token: null, user: null }, false);
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
    (collection: string, action: PermissionsAction) => {
      if (!me?.user || !permissions) return false;

      return (
        me.user.adminAccess ||
        permissions.some(
          (permission) => permission.collection === collection && permission.action === action
        )
      );
    },
    [me]
  );

  const value = useMemo(
    () => ({
      user: me?.user,
      permissions,
      hasPermission,
      login,
      logout,
      token: tokenInMemory,
    }),
    [me, permissions, hasPermission, login, logout]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

type UseAuth<T = AuthUser> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
