import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  hidden: boolean;
  singleton: boolean;
  statusField: string;
  draftValue: string;
  publishValue: string;
  unpublishValue: string;
};

export const updateCollection = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    hidden: yup.boolean(),
    singleton: yup.boolean(),
    statusField: yup.string(),
    draftValue: yup
      .string()
      .max(60)
      .when('statusField', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
    publishValue: yup
      .string()
      .max(60)
      .when('statusField', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
    unpublishValue: yup
      .string()
      .max(60)
      .when('statusField', {
        is: (value: string) => value,
        then: (schema) => schema.required(),
      }),
  });
};

export default updateCollection;
