import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  hidden: boolean;
  singleton: boolean;
  status: boolean;
  statusField: string;
  draftLabel: string;
  draftValue: string;
  publishLabel: string;
  publishValue: string;
  closeLabel: string;
  closeValue: string;
};

export const updateCollection = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    hidden: yup.boolean(),
    singleton: yup.boolean(),
    status: yup.boolean(),
    statusField: yup.string().when('status', {
      is: true,
      then: (schema) => schema.required(),
    }),
    draftLabel: yup
      .string()
      .max(60)
      .when('status', {
        is: true,
        then: (schema) => schema.required(),
      }),
    draftValue: yup
      .string()
      .max(60)
      .when('status', {
        is: true,
        then: (schema) => schema.required(),
      }),
    publishLabel: yup
      .string()
      .max(60)
      .when('status', {
        is: true,
        then: (schema) => schema.required(),
      }),
    publishValue: yup
      .string()
      .max(60)
      .when('status', {
        is: true,
        then: (schema) => schema.required(),
      }),
    closeLabel: yup
      .string()
      .max(60)
      .when('status', {
        is: true,
        then: (schema) => schema.required(),
      }),
    closeValue: yup
      .string()
      .max(60)
      .when('status', {
        is: true,
        then: (schema) => schema.required(),
      }),
  });
};

export default updateCollection;
