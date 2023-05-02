import jwtDecode from 'jwt-decode';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../../config/types.js';
import { logger } from '../../../../utilities/logger.js';
import { api, removeAuthorization, setAuthorization } from '../../../utilities/api.js';
import { AuthContext } from './types.js';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['superfast-token']);
  const token = cookies['superfast-token'];
  if (token) {
    setAuthorization(token);
  }

  const { data: newToken } = useSWR(
    token ? '/me' : null,
    (url) =>
      api
        .get<{ token: string }>(url)
        .then(({ data }) => data.token)
        .catch((e) => {
          logger.error(e);
          return null;
        }),
    {
      suspense: true,
    }
  );

  const user = useMemo(() => {
    return newToken ? jwtDecode<AuthUser>(newToken) : null;
  }, [newToken]);

  const { data: permissions } = useSWR(
    user ? `/roles/${user.roleId}/permissions` : null,
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

  const setToken = useCallback((token: string) => {
    setCookie('superfast-token', token, { path: '/' });
    setAuthorization(token);
  }, []);

  const hasPermission = useCallback(
    (collection: string, action: PermissionsAction) => {
      if (!user || !permissions) return false;

      return (
        user.adminAccess ||
        permissions.some(
          (permission) => permission.collection === collection && permission.action === action
        )
      );
    },
    [user]
  );

  const login = () =>
    useSWRMutation(
      `/authentications/login`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ token: string }>(url, arg).then((res) => {
          setToken(res.data.token);
          return res.data;
        });
      }
    );

  const logout = () => {
    removeCookie('superfast-token', { path: '/' });
    removeAuthorization();
  };

  const value = useMemo(
    () => ({
      user,
      permissions,
      setToken,
      hasPermission,
      login,
      logout,
    }),
    [user, permissions, setToken, hasPermission, login, logout]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

type UseAuth<T = AuthUser> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
