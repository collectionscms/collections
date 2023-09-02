import { Field, FieldInterface } from '../../../../../config/types.js';

export type Props = {
  collection: string;
  expanded: boolean;
  handleChange: (field: FieldInterface) => void;
  onEditing: (unsaved: boolean) => void;
  onSuccess: (field: Field) => void;
  onChangeParentViewInvisible?: (state: boolean) => void;
};
