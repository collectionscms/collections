import { Field } from '@shared/types';
import { SWRMutationResponse } from 'swr/mutation';

export type FieldContext = {
  createField: (slug: string) => SWRMutationResponse<Field>;
};
