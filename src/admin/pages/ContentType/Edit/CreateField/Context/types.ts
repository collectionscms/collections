import { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../../../config/types.js';

export type FieldContext = {
  createField: (collection: string) => SWRMutationResponse<Field, any, Record<string, any>, any>;
};
