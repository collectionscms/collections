import { Field } from '../../../../../config/types.js';

export type Props = {
  field: Field;
  onEditing: (unsaved: boolean) => void;
  onSuccess: (field: Field) => void;
  onChangeParentViewInvisible?: (state: boolean) => void;
};
