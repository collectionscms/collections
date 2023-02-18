import { PermissionsAction, User } from '@shared/types';
import jwtDecode from 'jwt-decode';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './types';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>();
  const [cookies, setCookie] = useCookies(['superfast-token']);
  const navigate = useNavigate();

  const setToken = useCallback((token: string) => {
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
    // TODO 手動実装につき後で消す
    setCookie('superfast-token', token);
  }, []);

  const hasPermission = useCallback(
    (collection: string, action: PermissionsAction) => {
      return (
        user.role.admin_access ||
        user.role.permissions.some(
          (permission) => permission.collection === collection && permission.action === action
        )
      );
    },
    [user]
  );

  useEffect(() => {
    const fetchMe = async () => {
      // TODO 手動実装につき後で消す
      const token = cookies['superfast-token'];

      if (token) {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } else {
        // TODO API取得のインターセプトで実装するので後で消す
        navigate('/admin/auth/login');
      }
    };
    fetchMe();
  }, [setToken]);

  const value = useMemo(
    () => ({
      user,
      setToken,
      hasPermission,
    }),
    [user, setToken, hasPermission]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

type UseAuth<T = User> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
