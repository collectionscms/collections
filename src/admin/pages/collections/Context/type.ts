import { Field } from '@shared/types';
import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';

export type ContentContext = {
  getContents: (slug: string, config?: SWRConfiguration) => SWRResponse<any[]>;
  getContent: (slug: string, id: string, config?: SWRConfiguration) => SWRResponse<any>;
  getFields: (slug: string, config?: SWRConfiguration) => SWRResponse<Field[]>;
  createContent: (slug: string) => SWRMutationResponse<unknown>;
  updateContent: (slug: string, id: string) => SWRMutationResponse<unknown>;
};
