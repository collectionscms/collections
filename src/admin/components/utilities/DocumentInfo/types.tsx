import { Field } from 'config/types';

export type ContextType = {
  label: string;
  fields: Field[];
};

export type Props = {
  label: string;
  fields: Field[];
  children?: React.ReactNode;
};
