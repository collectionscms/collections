import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  roleId: string;
};

export const updateUser = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    roleId: yup.string().required(),
  });
};
