import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  name: string;
  description: string;
};

export const createRole = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    description: yup.string().max(250),
  });
};

export default createRole;
