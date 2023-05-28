export type Props = {
  collection: string;
  field: string;
  openState: boolean;
  onSuccess: (contents: Partial<{ id: number }>[]) => void;
  onClose: () => void;
};
