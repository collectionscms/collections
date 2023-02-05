import { Role } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import useSWR, { SWRResponse } from 'swr';

type ContextType = {
  getRoles: () => SWRResponse<Role[]>;
  roles: Role[];
};

const Context = createContext<ContextType>({} as any);

export const RoleContextProvider = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);

  const getRoles = () =>
    useSWR('/api/roles', (url) =>
      axios
        .get<{ roles: Role[] }>(url)
        .then((res) => {
          setRoles(res.data.roles);
          return res.data.roles;
        })
        .catch((err) => Promise.reject(err.message))
    );

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
