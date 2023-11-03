import { Choice } from '../../../../config/types.js';

export type Props = {
  openState: boolean;
  values?: { id: string; label: string; value: string };
  onSave: (id: string | null, choice: Choice) => void;
  onClose: () => void;
};
