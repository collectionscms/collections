import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import {
  File,
  GetCollection,
  GetCollections,
  GetField,
  GetRelation,
} from '../../../../config/types.js';

export type ContentContext = {
  // If the collection model is a singleton, return any.
  getContents: (
    collection: string,
    canFetch?: boolean,
    config?: SWRConfiguration
  ) => SWRResponse<any | any[]>;
  getContent: (collection: string, id: string | null) => SWRMutationResponse<any>;
  getFields: (
    collection: string,
    canFetch?: boolean,
    config?: SWRConfiguration
  ) => SWRResponse<GetField[]>;
  createContent: (
    collection: string
  ) => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateContent: (
    collection: string,
    id: string
  ) => SWRMutationResponse<void, any, string, Record<string, any>>;
  getFileImage: (id: string | null) => SWRMutationResponse<{ file: File; raw: string }>;
  createFileImage: () => SWRMutationResponse<
    { file: File; raw: string },
    any,
    string,
    Record<string, any>
  >;
  getRelations: (collection: string, field: string) => SWRResponse<GetRelation[]>;
  getCollections: (collection: string | null) => SWRResponse<GetCollections>;
};
