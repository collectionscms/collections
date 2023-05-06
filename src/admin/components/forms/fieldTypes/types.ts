import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Field } from '../../../../config/types.js';

export type Props = {
  context: UseFormReturn<FieldValues, any>;
  field: Field;
};
