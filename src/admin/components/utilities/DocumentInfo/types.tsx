import { Field } from '@shared/types';

export type ContextType = {
  label: string;
  fields: Field[];
};

export type Props = {
  label: string;
  fields: Field[];
  children?: React.ReactNode;
};
