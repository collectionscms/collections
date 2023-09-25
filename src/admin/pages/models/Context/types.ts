import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { File, GetModel, GetField, GetRelation } from '../../../config/types.js';

export type ContentContext = {
  // If the model model is a singleton, return any.
  getContents: (modelId: string) => SWRResponse<any | any[], Error, { suspense: true }>;
  getContent: (modelId: string, id: string) => SWRResponse<any, Error, { suspense: true }>;
  getFields: (modelId: string) => SWRResponse<GetField[], Error, { suspense: true }>;
  createContent: (modelId: string) => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateContent: (
    modelId: string,
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
    modelId: string,
    field: string
  ) => SWRResponse<GetRelation[], Error, { suspense: true }>;
  getModel: (modelId: string) => SWRResponse<GetModel, Error, { suspense: true }>;
};
