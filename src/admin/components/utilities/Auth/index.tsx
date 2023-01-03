import { User } from '@shared/types';
import jwtDecode from 'jwt-decode';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './types';
import { useCookies } from 'react-cookie';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>();
  const [cookies, setCookie] = useCookies(['superfast-token']);

  const setToken = useCallback((token: string) => {
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
    // TODO 手動実装につき後で消す
    setCookie('superfast-token', token);
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      // TODO 手動実装につき後で消す
      const token = cookies['superfast-token'];

      if (token) {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      }
    };
    fetchMe();
  }, [setToken]);

  const value = useMemo(
    () => ({
      user,
      setToken,
    }),
    [user, setToken]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

type UseAuth<T = User> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
