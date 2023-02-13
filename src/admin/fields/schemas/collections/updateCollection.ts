import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  hidden: boolean;
  singleton: boolean;
};

export const updateCollection = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    hidden: yup.boolean(),
    singleton: yup.boolean(),
  });
};

export default updateCollection;
