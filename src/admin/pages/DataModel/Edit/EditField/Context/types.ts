import { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../../config/types.js';

export type FieldContext = {
  updateField: (
    id: number | string
  ) => SWRMutationResponse<Field, any, string, Record<string, any>>;
};
