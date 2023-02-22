import { User } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useSWR from 'swr';
import { UserContext } from './type';

const Context = createContext({} as UserContext);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getUsers = () =>
    useSWR('/api/users', (url) =>
      axios
        .get<{ users: User[] }>(url)
        .then((res) => res.data.users)
        .catch((err) => Promise.reject(err.message))
    );

  return (
    <Context.Provider
      value={{
        getUsers,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUser = () => useContext(Context);
