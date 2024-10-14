import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  slug: string;
};

export const updateSlugValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    slug: yup.string().required().max(250),
  });
};
