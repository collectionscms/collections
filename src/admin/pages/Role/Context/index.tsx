import { Role } from '@shared/types';
import React, { createContext, useContext } from 'react';
import useSWR from 'swr';
import api from '../../../utilities/api';
import { RoleContext } from './type';

const Context = createContext({} as RoleContext);

export const RoleContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getRoles = () =>
    useSWR('/roles', (url) =>
      api
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
