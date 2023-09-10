import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { File, GetCollection, GetField, GetRelation } from '../../../config/types.js';

export type ContentContext = {
  // If the collection model is a singleton, return any.
  getContents: (collection: string) => SWRResponse<any | any[], Error, { suspense: true }>;
  getContent: (collection: string, id: string) => SWRResponse<any, Error, { suspense: true }>;
  getFields: (collection: string) => SWRResponse<GetField[], Error, { suspense: true }>;
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
  getRelations: (
    collection: string,
    field: string
  ) => SWRResponse<GetRelation[], Error, { suspense: true }>;
  getCollection: (collection: string) => SWRResponse<GetCollection, Error, { suspense: true }>;
};
