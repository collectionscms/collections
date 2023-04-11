import { Field } from '../../../../../shared/types';

export type Props = {
  field: Field;
  open: boolean;
  onSuccess: (field: Field) => void;
  onClose: () => void;
};
