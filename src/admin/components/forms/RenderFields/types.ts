import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { Field } from '../../../../shared/types';

export type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  fields: Field[];
};
