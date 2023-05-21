import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Field, File } from '../../../../config/types.js';

export type ContentContext = {
  getContents: (
    canFetch: boolean,
    collection: string,
    config?: SWRConfiguration
  ) => SWRResponse<any[]>;
  getSingletonContent: (
    canFetch: boolean,
    collection: string,
    config?: SWRConfiguration
  ) => SWRResponse<any>;
  getContent: (collection: string, id: string | null) => SWRMutationResponse<any>;
  getFields: (collection: string, config?: SWRConfiguration) => SWRResponse<Field[]>;
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
};
