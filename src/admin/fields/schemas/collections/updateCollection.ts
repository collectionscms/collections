import { SchemaOf } from 'yup';
import yup from '../../yup';

export type FormValues = {
  hidden: boolean;
  singleton: boolean;
};

export const updateCollection = (): SchemaOf<FormValues> => {
  return yup.object().shape({
    hidden: yup.boolean(),
    singleton: yup.boolean(),
  });
};

export default updateCollection;
