import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  hidden: boolean;
  singleton: boolean;
  statusField?: string | null;
  draftValue?: string | null;
  publishValue?: string | null;
  archiveValue?: string | null;
};

export const updateCollection = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    hidden: yup.boolean().required(),
    singleton: yup.boolean().required(),
    statusField: yup.string(),
    draftValue: yup
      .string()
      .notRequired()
      .max(60)
      .when('statusField', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
    publishValue: yup
      .string()
      .notRequired()
      .max(60)
      .when('statusField', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
    archiveValue: yup
      .string()
      .notRequired()
      .max(60)
      .when('statusField', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
  });
};
