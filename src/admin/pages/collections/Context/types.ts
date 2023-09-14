import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { File, GetCollection, GetField, GetRelation } from '../../../config/types.js';

export type ContentContext = {
  // If the collection model is a singleton, return any.
  getContents: (collectionId: string) => SWRResponse<any | any[], Error, { suspense: true }>;
  getContent: (collectionId: string, id: string) => SWRResponse<any, Error, { suspense: true }>;
  getFields: (collectionId: string) => SWRResponse<GetField[], Error, { suspense: true }>;
  createContent: (
    collectionId: string
  ) => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateContent: (
    collectionId: string,
    id: string
  ) => SWRMutationResponse<void, any, string, Record<string, any>>;
  getFileImage: (id: string | null) => SWRMutationResponse<{ file: File; raw: string }>;
  createFileImage: () => SWRMutationResponse<
    { file: File; raw: string },
    any,
    string,
    Record<string, any>
  >;
  getRelations: (
    collectionId: string,
    field: string
  ) => SWRResponse<GetRelation[], Error, { suspense: true }>;
  getCollection: (collectionId: string) => SWRResponse<GetCollection, Error, { suspense: true }>;
};
