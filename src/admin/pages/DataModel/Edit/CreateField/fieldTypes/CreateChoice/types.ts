import { Choice } from '../../../../../../config/types.js';

export type Props = {
  openState: boolean;
  onSuccess: (choice: Choice) => void;
  onClose: () => void;
};
