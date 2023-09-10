import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, GetCollection, GetField, PostCollection } from '../../../config/types.js';

export type CollectionContext = {
  getCollections: () => SWRResponse<Collection[]>;
  getCollection: (collection: string) => SWRResponse<
    GetCollection,
    Error,
    {
      suspense: true;
    }
  >;
  createCollection: SWRMutationResponse<number, any, string, Omit<PostCollection, 'id'>>;
  updateCollection: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  getFields: (collection: string | null, config?: SWRConfiguration) => SWRResponse<GetField[]>;
  updateFields: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
