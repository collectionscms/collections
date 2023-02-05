import { Role } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import useSWR, { SWRResponse } from 'swr';

type ContextType = {
  getRoles: () => SWRResponse<Role[]>;
};

const Context = createContext<ContextType>({} as any);

export const RoleContextProvider = ({ children }) => {
  const getRoles = () =>
    useSWR('/api/roles', (url) =>
      axios
        .get<{ roles: Role[] }>(url)
        .then((res) => res.data.roles)
        .catch((err) => Promise.reject(err.message))
    );

  return (
    <Context.Provider
      value={{
        getRoles,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRole = () => useContext(Context);
