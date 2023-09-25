import { Model, Field, FieldInterface } from '../../../../../config/types.js';

export type Props = {
  model: Model;
  expanded: boolean;
  handleChange: (field: FieldInterface) => void;
  onEditing: (unsaved: boolean) => void;
  onSuccess: (field: Field) => void;
  onChangeParentViewInvisible?: (state: boolean) => void;
};
