import { Field } from '../../../../../shared/types';

export type Props = {
  slug: string;
  openState: boolean;
  onSuccess: (field: Field) => void;
  onClose: () => void;
};
