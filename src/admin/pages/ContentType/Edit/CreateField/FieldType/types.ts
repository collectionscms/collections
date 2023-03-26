import { Field, FieldInterface } from 'shared/types';

export type Props = {
  slug: string;
  expanded: boolean;
  handleChange: (field: FieldInterface) => void;
  onSuccess: (field: Field) => void;
};
