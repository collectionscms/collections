import { SchemaOf } from 'yup';
import yup from '../../yup';

export type FormValues = {
  name: string;
  singleton: boolean;
};

export const createCollection: SchemaOf<FormValues> = yup.object().shape({
  name: yup.string().required(),
  singleton: yup.boolean(),
});

export default createCollection;
