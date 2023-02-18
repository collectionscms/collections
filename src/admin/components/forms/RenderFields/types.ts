import { Field } from '@shared/types';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

export type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  fields: Field[];
};
