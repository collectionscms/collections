import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Field } from '../../../../config/types.js';

export type Props = {
  form: UseFormReturn<FieldValues, any>;
  field: Field;
};
