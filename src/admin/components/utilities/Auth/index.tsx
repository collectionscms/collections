import jwtDecode from 'jwt-decode';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../../shared/types';
import api, { removeAuthorization, setAuthorization } from '../../../utilities/api';
import { AuthContext } from './types';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>();
  const [permissions, setPermissions] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['superfast-token']);

  useSWR(user ? '/me' : null, (url) =>
    api.get<{ token: string }>(url).then((res) => {
      setToken(res.data.token);
    })
  );
  useSWR(user ? `/roles/${user.roleId}/permissions` : null, (url) =>
    api.get<{ permissions: Permission[] }>(url).then((res) => {
      setPermissions(res.data.permissions);
    })
  );

  const setToken = useCallback((token: string) => {
    const decoded = jwtDecode<AuthUser>(token);
    setUser(decoded);
    setCookie('superfast-token', token, { path: '/' });
    setAuthorization(token);
  }, []);

  const hasPermission = useCallback(
    (collection: string, action: PermissionsAction) => {
      return (
        user.adminAccess ||
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
    setUser(null);
    removeAuthorization();
  };

  // On mount, set token and get user
  useEffect(() => {
    const token = cookies['superfast-token'];
    if (token) {
      setToken(token);
    } else {
      setUser(null);
    }
  }, []);

  return (
    <Context.Provider
      value={{
        user,
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
