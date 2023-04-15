import { Field, FieldInterface } from 'shared/types';

export type Props = {
  slug: string;
  expanded: boolean;
  handleChange: (field: FieldInterface) => void;
  onEditing: (unsaved: boolean) => void;
  onSuccess: (field: Field) => void;
  onChangeParentViewInvisible?: (state: boolean) => void;
};
