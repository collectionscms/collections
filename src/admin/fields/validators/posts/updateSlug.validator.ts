import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  slug: string;
  excerpt?: string | null;
};

export const updateSlugValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    slug: yup.string().required().max(250),
    excerpt: yup.string().nullable(),
  });
};
