import { User } from '@shared/types';
import axios from 'axios';
import useSWR, { SWRResponse } from 'swr';
import React, { createContext, useContext, useState } from 'react';

type ContextType = {
  getUsers: () => SWRResponse<User[]>;
};

const Context = createContext<ContextType>({} as any);

export const UserContextProvider = ({ children }) => {
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
