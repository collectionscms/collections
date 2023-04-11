import { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../../../shared/types';

export type FieldContext = {
  updateField: (id: number) => SWRMutationResponse<Field, any, Record<string, any>, any>;
};
