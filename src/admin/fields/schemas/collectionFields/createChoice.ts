import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  label: string;
  value: string;
};

export const createChoice = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    label: yup.string().required().max(60),
    value: yup.string().required().max(60),
  });
};

export default createChoice;
