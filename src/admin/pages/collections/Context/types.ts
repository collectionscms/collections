import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Field, File, Relation } from '../../../../config/types.js';

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
  ) => SWRResponse<Field[]>;
  getPreviewContents: (collection: string) => SWRMutationResponse<any[]>;
  createContent: (collection: string) => SWRMutationResponse<number, any, Record<string, any>, any>;
  updateContent: (
    collection: string,
    id: string
  ) => SWRMutationResponse<void, any, Record<string, any>, any>;
  getFileImage: (id: string | null) => SWRMutationResponse<{ file: File; raw: string }>;
  createFileImage: () => SWRMutationResponse<
    { file: File; raw: string },
    any,
    Record<string, any>,
    any
  >;
  getRelations: (collection: string, field: string) => SWRResponse<Relation[]>;
};
