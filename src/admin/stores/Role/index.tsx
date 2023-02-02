import { Role } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

type ContextType = {
  getRoles: () => Promise<Role[]>;
  roles: Role[];
};

const Context = createContext<ContextType>({} as any);

export const RoleContextProvider = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);

  const getRoles = async () => {
    try {
      const response = await axios.get<{ roles: Role[] }>('/api/roles');
      setRoles(response.data.roles);
      return response.data.roles;
    } catch (e) {
      throw e.response.data;
    }
  };

  return (
    <Context.Provider
      value={{
        getRoles,
        roles,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRole = () => useContext(Context);
