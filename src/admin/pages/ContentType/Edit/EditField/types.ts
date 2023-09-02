import { Field } from '../../../../config/types.js';

export type Props = {
  field: Field;
  open: boolean;
  onSuccess: (field: Field) => void;
  onClose: () => void;
};
