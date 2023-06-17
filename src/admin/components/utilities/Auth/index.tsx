import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../../config/types.js';
import { logger } from '../../../../utilities/logger.js';
import { api, removeAuthorization, setAuthorization } from '../../../utilities/api.js';
import { AuthContext } from './types.js';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    data: me,
    mutate,
    error,
  } = useSWR('/me', (url) =>
    api
      .get<{
        token: string | null;
        user: AuthUser | null;
        exp: number | null;
      }>(url)
      .then(({ data }) => {
        if (data.token) {
          setAuthorization(data.token);
        }
        return data;
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

  useEffect(() => {
    if (error === undefined) return;
    removeAuthorization();
  }, [error]);

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

  const login = () =>
    useSWRMutation(
      `/authentications/login`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ token: string; user: AuthUser; exp: number }>(url, arg).then((res) => {
          setAuthorization(res.data.token);
          mutate(res.data);
          return res.data;
        });
      }
    );

  const logout = () =>
    useSWRMutation(`/authentications/logout`, async (url: string) => {
      return api.post(url).then((res) => {
        removeAuthorization();
        mutate({ token: null, user: null, exp: null });
        return res;
      });
    });

  const value = useMemo(
    () => ({
      user: me?.user,
      permissions,
      hasPermission,
      login,
      logout,
    }),
    [me, permissions, hasPermission, login, logout]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

type UseAuth<T = AuthUser> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
