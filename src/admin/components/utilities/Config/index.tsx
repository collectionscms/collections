import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { AuthUser, Model, Permission } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { useAuth } from '../Auth/index.js';
import { ConfigContext, Props } from './types.js';

const Context = createContext({} as ConfigContext);

const filteredModelsWithReadPermission = (
  user: AuthUser | null,
  permissions: Permission[] | null,
  models: Model[]
): Model[] => {
  if (!user || !permissions) return [];
  if (user.admin_access) return models;

  return models.filter(
    (model) =>
      permissions?.some(
        (permission) => permission.model === model.model && permission.action === 'read'
      )
  );
};

export const ConfigProvider: React.FC<Props> = ({ children }) => {
  const { user, permissions } = useAuth();

  const { data: models, mutate } = useSWR(
    user ? '/models' : null,
    (url) =>
      api
        .get<{ models: Model[] }>(url)
        .then((res) =>
          filteredModelsWithReadPermission(user || null, permissions || null, res.data.models)
        ),
    { suspense: true }
  );

  const revalidateModels = () => {
    mutate();
  };

  const value = useMemo(
    () => ({
      permittedModels: models,
      revalidateModels,
    }),
    [models, revalidateModels]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useConfig = (): ConfigContext => useContext(Context);

export default Context;
