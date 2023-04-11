import { Field } from 'shared/types';

export type Props = {
  field: Field;
  onEditing: (unsaved: boolean) => void;
  onSuccess: (field: Field) => void;
};
