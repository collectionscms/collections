import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  slug: string;
  status: string;
};

export const editPostValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    slug: yup.string().required(),
    status: yup.string().required(),
  });
};
