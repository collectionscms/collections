import { AuthUser, PermissionsAction, User } from '@shared/types';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { AuthContext } from './types';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>();
  const [permissions, setPermissions] = useState([]);
  const [cookies, setCookie] = useCookies(['superfast-token']);
  const navigate = useNavigate();

  const setToken = useCallback((token: string) => {
    const decoded = jwtDecode<AuthUser>(token);
    setUser(decoded);
    setCookie('superfast-token', token);
  }, []);

  const hasPermission = useCallback(
    (collection: string, action: PermissionsAction) => {
      return (
        user.admin_access ||
        permissions.some(
          (permission) => permission.collection === collection && permission.action === action
        )
      );
    },
    [user]
  );

  const login = (): SWRMutationResponse =>
    useSWRMutation(`/api/authentications/login`, async (url: string, { arg }) => {
      return axios
        .post<{ token: string }>(url, arg)
        .then((res) => {
          setToken(res.data.token);
          return res.data;
        })
        .catch((err) => Promise.reject(err.message));
    });

  useEffect(() => {
    const fetchMe = async () => {
      // TODO 手動実装につき後で消す
      const token = cookies['superfast-token'];

      if (token) {
        const decoded = jwtDecode<AuthUser>(token);
        setUser(decoded);
      } else {
        // TODO API取得のインターセプトで実装するので後で消す
        navigate('/admin/auth/login');
      }
    };
    fetchMe();
  }, [setToken]);

  return (
    <Context.Provider
      value={{
        user,
        permissions,
        setToken,
        hasPermission,
        login,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = AuthUser> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
