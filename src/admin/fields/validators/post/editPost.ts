import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  slug: string;
  status: string;
  title?: string;
  body?: string;
};

export const editPostValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    slug: yup.string().required(),
    status: yup.string().required(),
    title: yup.string().when('status', {
      is: 'review',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    body: yup.string(),
  });
};
