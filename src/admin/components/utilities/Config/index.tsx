import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { AuthUser, Collection, Permission } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { useAuth } from '../Auth/index.js';
import { ConfigContext, Props } from './types.js';

const Context = createContext({} as ConfigContext);

const filteredCollectionsWithReadPermission = (
  user: AuthUser | null,
  permissions: Permission[] | null,
  collections: Collection[]
): Collection[] => {
  if (!user || !permissions) return [];
  if (user.adminAccess) return collections;

  return collections.filter(
    (collection) =>
      permissions?.some(
        (permission) =>
          permission.collection === collection.collection && permission.action === 'read'
      )
  );
};

export const ConfigProvider: React.FC<Props> = ({ children }) => {
  const { user, permissions } = useAuth();

  const { data: collections, mutate } = useSWR(
    user ? '/collections' : null,
    (url) =>
      api
        .get<{ collections: Collection[] }>(url)
        .then((res) =>
          filteredCollectionsWithReadPermission(
            user || null,
            permissions || null,
            res.data.collections
          )
        ),
    { suspense: true }
  );

  const revalidateCollections = () => {
    mutate();
  };

  const value = useMemo(
    () => ({
      permittedCollections: collections,
      revalidateCollections,
    }),
    [collections, revalidateCollections]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useConfig = (): ConfigContext => useContext(Context);

export default Context;
