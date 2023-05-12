import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Field, File } from '../../../../config/types.js';

export type ContentContext = {
  getContents: (canFetch: boolean, slug: string, config?: SWRConfiguration) => SWRResponse<any[]>;
  getSingletonContent: (
    canFetch: boolean,
    slug: string,
    config?: SWRConfiguration
  ) => SWRResponse<any>;
  getContent: (slug: string, id: string | null) => SWRMutationResponse<any>;
  getFields: (slug: string, config?: SWRConfiguration) => SWRResponse<Field[]>;
  getPreviewContents: (slug: string) => SWRMutationResponse<any[]>;
  createContent: (slug: string) => SWRMutationResponse<unknown, any, Record<string, any>, any>;
  updateContent: (
    slug: string,
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
