import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Field } from '../../../../../config/types.js';

export type FieldContext = {
  createField: () => SWRMutationResponse<Field, any, string, Record<string, any>>;
  createRelationalFields: () => SWRMutationResponse<Field[], any, string, Record<string, any>>;
  getCollections: () => SWRResponse<Collection[], Error, { suspense: true }>;
};
