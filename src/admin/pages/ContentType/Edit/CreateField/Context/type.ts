import { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../../../shared/types';

export type FieldContext = {
  createField: (slug: string) => SWRMutationResponse<Field, any, Record<string, any>, any>;
};
