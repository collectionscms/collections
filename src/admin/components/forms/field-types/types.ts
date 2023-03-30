import { Control, FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { Field } from '../../../../shared/types';

export type Props = {
  control: Control<FieldValues, any>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  field: Field;
};
