import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Field } from '../../../../shared/types';

export type CollectionContext = {
  getCollection: (id: string, config?: SWRConfiguration) => SWRResponse<Collection>;
  getCollections: () => SWRResponse<Collection[]>;
  createCollection: SWRMutationResponse<Collection, any, Record<string, any>, any>;
  updateCollection: (id: string) => SWRMutationResponse<Collection>;
  getFields: (slug: string, config?: SWRConfiguration) => SWRResponse<Field[]>;
};
