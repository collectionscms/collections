import { Field } from '@shared/types';

export type Props = {
  id: string;
  openState: boolean;
  onSuccess: (field: Field) => void;
  onClose: () => void;
};
