import { Field } from '../../../../../config/types.js';

export type Props = {
  slug: string;
  openState: boolean;
  onSuccess: (field: Field) => void;
  onClose: () => void;
};
