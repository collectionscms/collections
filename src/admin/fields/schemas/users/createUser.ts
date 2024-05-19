import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  email: string;
  roleId: string;
};

export const inviteUser = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    email: yup.string().required().email().max(250),
    roleId: yup.string().required(),
  });
};
