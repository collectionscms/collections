import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Field } from '../../../../config/types.js';

export type CollectionContext = {
  getCollection: (id: string) => SWRMutationResponse<Collection>;
  getCollections: () => SWRResponse<Collection[]>;
  createCollection: SWRMutationResponse<number, any, string, Record<string, any>>;
  updateCollection: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  getFields: (collection: string | null, config?: SWRConfiguration) => SWRResponse<Field[]>;
  updateFields: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
