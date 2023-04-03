import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../shared/types';

export type ContentContext = {
  getContents: (canFetch: boolean, slug: string, config?: SWRConfiguration) => SWRResponse<any[]>;
  getSingletonContent: (
    canFetch: boolean,
    slug: string,
    config?: SWRConfiguration
  ) => SWRResponse<any>;
  getContent: (slug: string, id: string, config?: SWRConfiguration) => SWRResponse<any>;
  getFields: (slug: string, config?: SWRConfiguration) => SWRResponse<Field[]>;
  getPreviewContents: (slug: string) => SWRMutationResponse<any[]>;
  createContent: (slug: string) => SWRMutationResponse<unknown>;
  updateContent: (slug: string, id: string) => SWRMutationResponse<unknown>;
};
