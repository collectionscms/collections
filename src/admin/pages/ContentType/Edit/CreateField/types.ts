import { Field } from '../../../../../config/types.js';

export type Props = {
  collection: string;
  openState: boolean;
  onSuccess: (field: Field) => void;
  onClose: () => void;
};
