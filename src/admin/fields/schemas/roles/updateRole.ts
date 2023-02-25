import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  name: string;
  description: string;
  adminAccess: boolean;
};

export const updateRole = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    description: yup.string().max(250),
    adminAccess: yup.boolean(),
  });
};

export default updateRole;
