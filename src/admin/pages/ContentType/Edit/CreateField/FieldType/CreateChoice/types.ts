import { Choice } from '../../../../../../../shared/types';

export type Props = {
  openState: boolean;
  onSuccess: (choice: Choice) => void;
  onClose: () => void;
};
