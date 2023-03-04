import jwtDecode from 'jwt-decode';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../../shared/types';
import api, { removeAuthorization, setAuthorization } from '../../../utilities/api';
import { AuthContext } from './types';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>();
  const [permissions, setPermissions] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['superfast-token']);
  const navigate = useNavigate();
  const { data, trigger } = useSWRMutation(
    user?.id ? `/roles/${user.id}/permissions` : null,
    async (url: string, { arg }) => {
      return api.get<{ permissions: Permission[] }>(url, arg).then((res) => {
        return res.data.permissions;
      });
    }
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

  const { trigger: fetchMeTrigger } = useSWRMutation(`/me`, async (url: string) => {
    return api.get<{ token: string }>(url).then((res) => {
      return res.data.token;
    });
  });

  useEffect(() => {
    if (data === undefined) return;
    setPermissions(data);
  }, [data]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const newToken = await fetchMeTrigger();
        setToken(newToken);
      } catch (e) {
        // TODO install logger
        console.log(e);
        logout();
        navigate('/admin/auth/login');
      }
    };

    const token = cookies['superfast-token'];
    if (token) {
      setToken(token);
      fetchMe();
    }
  }, [setToken]);

  useEffect(() => {
    if (user) {
      trigger();
    }
  }, [user]);

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
