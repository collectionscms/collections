import { User } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  getUsers: () => Promise<User[]>;
  users: User[];
};

const Context = createContext<UserContextType>({} as any);

export const UserContextProvider = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>('/api/users');
      setUsers(response.data.users);
      return response.data.users;
    } catch (e) {
      throw e.response.data;
    }
  };

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
