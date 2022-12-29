import { User } from '@shared/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './types';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>();
  const [tokenInMemory, setTokenInMemory] = useState<string>();

  const setToken = useCallback((token: string) => {
    setTokenInMemory(token);
  }, []);

  useEffect(() => {
    const fetchMe = async () => {
      setUser({
        id: 1,
        email: 'user@example.com',
        userName: 'AdminUser',
        role: {
          id: 1,
          name: 'Administrator',
          adminAccess: true,
          permissions: [],
        },
      });

      setToken('token');
    };

    fetchMe();
  }, [setToken]);

  const value = useMemo(
    () => ({
      user,
      token: tokenInMemory,
    }),
    [user, tokenInMemory]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

type UseAuth<T = User> = () => AuthContext<T>;

export const useAuth: UseAuth = () => useContext(Context);
