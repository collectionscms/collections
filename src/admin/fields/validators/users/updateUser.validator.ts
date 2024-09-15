import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  roleId: string;
};

export const updateUserValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    roleId: yup.string().required(),
  });
};
