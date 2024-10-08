import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  email: string;
  roleId: string;
};

export const inviteUserValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    email: yup.string().required().email(),
    roleId: yup.string().required(),
  });
};
