import { User } from '@shared/types';
import axios from 'axios';
import useSWR, { SWRResponse } from 'swr';
import React, { createContext, useContext, useState } from 'react';

type ContextType = {
  getUsers: () => SWRResponse<User[]>;
  users: User[];
};

const Context = createContext<ContextType>({} as any);

export const UserContextProvider = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = () =>
    useSWR('/api/users', (url) =>
      axios
        .get<{ users: User[] }>(url)
        .then((res) => {
          setUsers(res.data.users);
          return res.data.users;
        })
        .catch((err) => Promise.reject(err.message))
    );

  return (
    <Context.Provider
      value={{
        getUsers,
        users,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUser = () => useContext(Context);
