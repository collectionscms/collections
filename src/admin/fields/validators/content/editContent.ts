import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  status: string;
  title?: string;
  body?: string;
};

export const editContentValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    status: yup.string().required(),
    title: yup.string().when('status', {
      is: 'review',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    body: yup.string(),
  });
};
