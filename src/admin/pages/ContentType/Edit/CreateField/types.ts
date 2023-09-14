import { Collection, Field } from '../../../../config/types.js';

export type Props = {
  collection: Collection;
  openState: boolean;
  onSuccess: (field: Field) => void;
  onClose: () => void;
};
