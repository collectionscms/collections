import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, GetCollection, GetField, PostCollection } from '../../../config/types.js';

export type CollectionContext = {
  getCollection: (id: string) => SWRMutationResponse<GetCollection>;
  getCollections: () => SWRResponse<Collection[]>;
  createCollection: SWRMutationResponse<number, any, string, Omit<PostCollection, 'id'>>;
  updateCollection: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  getFields: (collection: string | null, config?: SWRConfiguration) => SWRResponse<GetField[]>;
  updateFields: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
