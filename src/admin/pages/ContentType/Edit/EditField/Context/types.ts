import { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../../../config/types.js';

export type FieldContext = {
  updateField: (id: number) => SWRMutationResponse<Field, any, string, Record<string, any>>;
};
