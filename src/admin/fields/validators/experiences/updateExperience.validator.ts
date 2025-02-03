import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  experiences?: { name: string; url?: string; resourceUrls?: string[] }[];
};

export const updateExperienceValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    experiences: yup.array().of(
      yup.object().shape({
        name: yup.string().required().max(250),
        url: yup.string().url().optional(),
        resourceUrls: yup.array(),
      })
    ),
  });
};
