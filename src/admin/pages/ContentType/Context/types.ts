import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, GetCollection, GetField, PostCollection } from '../../../config/types.js';

export type CollectionContext = {
  getCollection: (collection: string) => SWRResponse<
    GetCollection,
    Error,
    {
      suspense: true;
    }
  >;
  getCollections: () => SWRResponse<
    Collection[],
    Error,
    {
      suspense: true;
    }
  >;
  createCollection: SWRMutationResponse<number, any, string, Omit<PostCollection, 'id'>>;
  updateCollection: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  getFields: (collection: string) => SWRResponse<
    GetField[],
    Error,
    {
      suspense: true;
    }
  >;
  updateFields: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
