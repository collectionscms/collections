import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  description?: string | null;
  admin_access: boolean;
};

export const updateRole = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    description: yup.string().notRequired().max(250),
    admin_access: yup.boolean().required(),
  });
};
