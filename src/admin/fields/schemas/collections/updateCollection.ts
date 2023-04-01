import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  hidden: boolean;
  singleton: boolean;
  status: boolean;
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
    draftLabel: yup.string().required().max(60),
    draftValue: yup.string().required().max(60),
    publishLabel: yup.string().required().max(60),
    publishValue: yup.string().required().max(60),
    closeLabel: yup.string().required().max(60),
    closeValue: yup.string().required().max(60),
  });
};

export default updateCollection;
