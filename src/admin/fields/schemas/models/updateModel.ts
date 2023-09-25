import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  hidden: boolean;
  singleton: boolean;
  status_field?: string | null;
  draft_value?: string | null;
  publish_value?: string | null;
  archive_value?: string | null;
};

export const updateModel = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    hidden: yup.boolean().required(),
    singleton: yup.boolean().required(),
    status_field: yup.string(),
    draft_value: yup
      .string()
      .notRequired()
      .max(60)
      .when('status_field', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
    publish_value: yup
      .string()
      .notRequired()
      .max(60)
      .when('status_field', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
    archive_value: yup
      .string()
      .notRequired()
      .max(60)
      .when('status_field', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
  });
};
