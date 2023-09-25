import { Model, Field } from '../../../../config/types.js';

export type Props = {
  model: Model;
  openState: boolean;
  onSuccess: (field: Field) => void;
  onClose: () => void;
};
