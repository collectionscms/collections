import jwtDecode from 'jwt-decode';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../../shared/types';
import logger from '../../../../utilities/logger';
import api, { removeAuthorization, setAuthorization } from '../../../utilities/api';
import { AuthContext } from './types';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
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

  const user = useCallback(() => {
    return newToken ? jwtDecode<AuthUser>(newToken) : null;
  }, [newToken]);

  useSWR(user() ? `/roles/${user().roleId}/permissions` : null, (url) =>
    api.get<{ permissions: Permission[] }>(url).then((res) => {
      setPermissions(res.data.permissions);
    })
  );

  const setToken = useCallback((token: string) => {
    setCookie('superfast-token', token, { path: '/' });
    setAuthorization(token);
  }, []);

  const hasPermission = useCallback(
    (collection: string, action: PermissionsAction) => {
      return (
        user().adminAccess ||
        permissions.some(
          (permission) => permission.collection === collection && permission.action === action
        )
      );
    },
    [user]
  );

  const login = (): SWRMutationResponse =>
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

  return (
    <Context.Provider
      value={{
        user: user(),
        permissions,
        setToken,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = AuthUser> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
